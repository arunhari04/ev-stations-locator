from django.views.generic import TemplateView, FormView, RedirectView, DetailView, UpdateView, DeleteView, ListView, CreateView
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy
from django.shortcuts import redirect, render, get_object_or_404
from django.db import transaction
from django.core.paginator import Paginator
from stations.models import Station, Address, Amenity, StationAmenity, ChargerType, StationCharger

class AdminRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_authenticated and self.request.user.is_staff

class AdminLoginView(LoginView):
    template_name = 'admin/login.html'
    redirect_authenticated_user = True
    
    def get_success_url(self):
        return reverse_lazy('admin-dashboard')

    def form_invalid(self, form):
        return self.render_to_response(self.get_context_data(form=form, error="Invalid email or password"))

class AdminLogoutView(LogoutView):
    next_page = reverse_lazy('admin-login')

class AdminDashboardView(AdminRequiredMixin, TemplateView):
    template_name = 'admin/dashboard.html'

class AdminStationsView(AdminRequiredMixin, TemplateView):
    template_name = 'admin/stations.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        stations_list = Station.objects.select_related('address').all().order_by('-created_at')
        paginator = Paginator(stations_list, 10)  # Show 10 stations per page

        page_number = self.request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        
        context['stations'] = page_obj
        context['page_obj'] = page_obj
        return context

class AdminStationDetailView(AdminRequiredMixin, DetailView):
    model = Station
    template_name = 'admin/station_detail.html'
    context_object_name = 'station'

class AdminAddStationView(AdminRequiredMixin, TemplateView):
    template_name = 'admin/add-station.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['amenities'] = Amenity.objects.filter(category='station')
        context['charger_types'] = ChargerType.objects.all()
        return context

    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                # 1. Create Address
                address = Address.objects.create(
                    street=request.POST.get('address'),
                    city=request.POST.get('city'),
                    state=request.POST.get('state'),
                    zip_code=request.POST.get('zip_code'),
                    latitude=request.POST.get('latitude') or None,
                    longitude=request.POST.get('longitude') or None
                )

                # 2. Create Station
                station = Station.objects.create(
                    name=request.POST.get('name'),
                    operator_name=request.POST.get('operator_name'),
                    status=request.POST.get('status', 'active').lower(),
                    opening_hours=request.POST.get('opening_hours'),
                    address=address
                )

                # 3. Add Amenities
                amenity_ids = request.POST.getlist('amenities')
                for am_id in amenity_ids:
                    try:
                        amenity = Amenity.objects.get(id=am_id)
                        StationAmenity.objects.create(station=station, amenity=amenity)
                    except Amenity.DoesNotExist:
                        continue

                # 4. Add Chargers
                charger_types = request.POST.getlist('charger_types[]')
                start_prices = request.POST.getlist('start_prices[]')
                end_prices = request.POST.getlist('end_prices[]')

                for i, ct_id in enumerate(charger_types):
                    if not ct_id: continue
                    try:
                        c_type = ChargerType.objects.get(id=ct_id)
                        
                        s_price = start_prices[i] if i < len(start_prices) and start_prices[i] else 0
                        e_price = end_prices[i] if i < len(end_prices) and end_prices[i] else 0

                        StationCharger.objects.create(
                            station=station, 
                            charger_type=c_type,
                            start_price=s_price,
                            end_price=e_price
                        )
                    except ChargerType.DoesNotExist:
                        continue

            return redirect('admin-stations')
        except Exception as e:
            print(f"Error creating station: {e}")
            context = self.get_context_data()
            context['error'] = str(e)
            return render(request, self.template_name, context)

class AdminStationEditView(AdminRequiredMixin, UpdateView):
    model = Station
    template_name = 'admin/add-station.html' 
    fields = ['name', 'operator_name', 'status', 'opening_hours']
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['is_edit'] = True
        context['amenities'] = Amenity.objects.filter(category='station')
        context['charger_types'] = ChargerType.objects.all()
        
        # Pre-select amenities
        station = self.get_object()
        context['selected_amenities'] = list(station.station_amenities.values_list('amenity_id', flat=True))
        return context
        
    def post(self, request, *args, **kwargs):
        station = self.get_object()
        try:
            with transaction.atomic():
                # 1. Update Address
                address = station.address
                if address:
                    address.street = request.POST.get('address')
                    address.city = request.POST.get('city')
                    address.state = request.POST.get('state')
                    address.zip_code = request.POST.get('zip_code')
                    address.latitude = request.POST.get('latitude') or None
                    address.longitude = request.POST.get('longitude') or None
                    address.save()

                # 2. Update Station Fields
                station.name = request.POST.get('name')
                station.operator_name = request.POST.get('operator_name')
                station.status = request.POST.get('status', 'active').lower()
                station.opening_hours = request.POST.get('opening_hours')
                station.save()

                # 3. Update Amenities (Clear and Re-add)
                StationAmenity.objects.filter(station=station).delete()
                amenity_ids = request.POST.getlist('amenities')
                for am_id in amenity_ids:
                    try:
                        amenity = Amenity.objects.get(id=am_id)
                        StationAmenity.objects.create(station=station, amenity=amenity)
                    except Amenity.DoesNotExist:
                        continue

                # 4. Update Chargers (Clear and Re-add)
                StationCharger.objects.filter(station=station).delete()
                charger_types = request.POST.getlist('charger_types[]')
                start_prices = request.POST.getlist('start_prices[]')
                end_prices = request.POST.getlist('end_prices[]')

                for i, ct_id in enumerate(charger_types):
                    if not ct_id: continue
                    try:
                        c_type = ChargerType.objects.get(id=ct_id)
                        
                        s_price = start_prices[i] if i < len(start_prices) and start_prices[i] else 0
                        e_price = end_prices[i] if i < len(end_prices) and end_prices[i] else 0

                        StationCharger.objects.create(
                            station=station, 
                            charger_type=c_type,
                            start_price=s_price,
                            end_price=e_price
                        )
                    except ChargerType.DoesNotExist:
                        continue

            return redirect('admin-stations')
        except Exception as e:
            print(f"Error updating station: {e}")
            context = self.get_context_data()
            context['error'] = str(e)
            return render(request, self.template_name, context)

class AdminStationDeleteView(AdminRequiredMixin, DeleteView):
    model = Station
    success_url = reverse_lazy('admin-stations')
    template_name = 'admin/station_confirm_delete.html'

# --- Amenities Management ---
class AdminAmenitiesView(AdminRequiredMixin, ListView):
    model = Amenity
    template_name = 'admin/amenities.html'
    context_object_name = 'amenities'
    paginate_by = 20
    ordering = ['category', 'name']
    
    def get_queryset(self):
        return Amenity.objects.all().order_by('category', 'name')

class AdminAddAmenityView(AdminRequiredMixin, CreateView):
    model = Amenity
    template_name = 'admin/add-amenity.html'
    fields = ['name', 'category']
    success_url = reverse_lazy('admin-amenities')

    def form_valid(self, form):
        # We no longer force 'station' category
        return super().form_valid(form)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['is_edit'] = False
        return context

class AdminEditAmenityView(AdminRequiredMixin, UpdateView):
    model = Amenity
    template_name = 'admin/add-amenity.html'
    fields = ['name', 'category']
    success_url = reverse_lazy('admin-amenities')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['is_edit'] = True
        return context

class AdminDeleteAmenityView(AdminRequiredMixin, DeleteView):
    model = Amenity
    template_name = 'admin/amenity_confirm_delete.html'
    success_url = reverse_lazy('admin-amenities')

# --- Charger Types Management ---
class AdminChargerTypesView(AdminRequiredMixin, ListView):
    model = ChargerType
    template_name = 'admin/charger-types.html'
    context_object_name = 'charger_types'
    paginate_by = 10
    ordering = ['name']

class AdminAddChargerTypeView(AdminRequiredMixin, CreateView):
    model = ChargerType
    template_name = 'admin/add-charger-type.html'
    fields = ['name', 'connector_type', 'max_power_kw']
    success_url = reverse_lazy('admin-charger-types')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['is_edit'] = False
        return context

class AdminEditChargerTypeView(AdminRequiredMixin, UpdateView):
    model = ChargerType
    template_name = 'admin/add-charger-type.html'
    fields = ['name', 'connector_type', 'max_power_kw']
    success_url = reverse_lazy('admin-charger-types')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['is_edit'] = True
        return context

class AdminDeleteChargerTypeView(AdminRequiredMixin, DeleteView):
    model = ChargerType
    template_name = 'admin/charger_type_confirm_delete.html'
    success_url = reverse_lazy('admin-charger-types')

# --- Other Views ---

class AdminShowroomsView(AdminRequiredMixin, TemplateView):
    template_name = 'admin/showrooms.html'

class AdminAddShowroomView(AdminRequiredMixin, TemplateView):
    template_name = 'admin/add-showroom.html'

class AdminServiceCentersView(AdminRequiredMixin, TemplateView):
    template_name = 'admin/service-centers.html'

class AdminAddServiceCenterView(AdminRequiredMixin, TemplateView):
    template_name = 'admin/add-service-center.html'

class AdminUsersView(AdminRequiredMixin, TemplateView):
    template_name = 'admin/users.html'

class AdminAnalyticsView(AdminRequiredMixin, TemplateView):
    template_name = 'admin/analytics.html'

class AdminSettingsView(AdminRequiredMixin, TemplateView):
    template_name = 'admin/settings.html'
