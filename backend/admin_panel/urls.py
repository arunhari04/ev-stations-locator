from django.urls import path
from .views import (
    AdminLoginView, AdminLogoutView, AdminDashboardView, AdminStationsView, AdminAddStationView,
    AdminStationDetailView, AdminStationEditView, AdminStationDeleteView,
    AdminAmenitiesView, AdminAddAmenityView, AdminEditAmenityView, AdminDeleteAmenityView,
    AdminChargerTypesView, AdminAddChargerTypeView, AdminEditChargerTypeView, AdminDeleteChargerTypeView,
    AdminShowroomsView, AdminAddShowroomView, AdminServiceCentersView,
    AdminAddServiceCenterView, AdminUsersView, AdminAnalyticsView, AdminSettingsView
)

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='admin-login'),
    path('logout/', AdminLogoutView.as_view(), name='admin-logout'),
    path('dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    
    # Stations
    path('stations/', AdminStationsView.as_view(), name='admin-stations'),
    path('stations/add/', AdminAddStationView.as_view(), name='admin-add-station'),
    path('stations/<int:pk>/', AdminStationDetailView.as_view(), name='admin-station-detail'),
    path('stations/<int:pk>/edit/', AdminStationEditView.as_view(), name='admin-station-edit'),
    path('stations/<int:pk>/delete/', AdminStationDeleteView.as_view(), name='admin-station-delete'),

    # Amenities
    path('amenities/', AdminAmenitiesView.as_view(), name='admin-amenities'),
    path('amenities/add/', AdminAddAmenityView.as_view(), name='admin-add-amenity'),
    path('amenities/<int:pk>/edit/', AdminEditAmenityView.as_view(), name='admin-amenity-edit'),
    path('amenities/<int:pk>/delete/', AdminDeleteAmenityView.as_view(), name='admin-amenity-delete'),

    # Charger Types
    path('charger-types/', AdminChargerTypesView.as_view(), name='admin-charger-types'),
    path('charger-types/add/', AdminAddChargerTypeView.as_view(), name='admin-add-charger-type'),
    path('charger-types/<int:pk>/edit/', AdminEditChargerTypeView.as_view(), name='admin-charger-type-edit'),
    path('charger-types/<int:pk>/delete/', AdminDeleteChargerTypeView.as_view(), name='admin-charger-type-delete'),

    path('showrooms/', AdminShowroomsView.as_view(), name='admin-showrooms'),
    path('showrooms/add/', AdminAddShowroomView.as_view(), name='admin-add-showroom'),
    path('service-centers/', AdminServiceCentersView.as_view(), name='admin-service-centers'),
    path('service-centers/add/', AdminAddServiceCenterView.as_view(), name='admin-add-service-center'),
    path('users/', AdminUsersView.as_view(), name='admin-users'),
    path('analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('settings/', AdminSettingsView.as_view(), name='admin-settings'),
]
