from django.contrib import admin
from .models import (
    Amenity, Station, StationCharger, StationAmenity,
    ChargerType, Favorite, Brand, Showroom, ShowroomAmenity,
    ServiceCenter, ServiceAmenity
)

@admin.register(ChargerType)
class ChargerTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'connector_type', 'max_power_kw')

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)

# Favorites
@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'station', 'showroom', 'service_center', 'created_at')

# Station Admin
from .models import Station, StationAmenity, StationCharger

class StationChargerInline(admin.TabularInline):
    model = StationCharger
    extra = 1

class StationAmenityInline(admin.TabularInline):
    model = StationAmenity
    extra = 1

@admin.register(StationCharger)
class StationChargerAdmin(admin.ModelAdmin):
    list_display = ('station', 'charger_type', 'start_price', 'end_price', 'is_available')
    list_filter = ('charger_type', 'station')
    search_fields = ('station__name', 'charger_type__name')

@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = ('name', 'operator_name', 'status', 'city', 'state')
    list_filter = ('status', 'state')
    search_fields = ('name', 'operator_name', 'street_address')

# Showroom Admin
from .models import Brand, Showroom, ShowroomAmenity

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name',)

# Service Center Admin
class ServiceAmenityInline(admin.TabularInline):
    model = ServiceAmenity
    extra = 1

@admin.register(ServiceCenter)
class ServiceCenterAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_emergency_service', 'status', 'city', 'state')
    list_filter = ('is_emergency_service', 'status', 'state')
    search_fields = ('name', 'city')
    inlines = [ServiceAmenityInline]

class ShowroomAmenityInline(admin.TabularInline):
    model = ShowroomAmenity
    extra = 1

@admin.register(Showroom)
class ShowroomAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'status', 'city', 'state')
    list_filter = ('brand', 'status', 'city')
    search_fields = ('name', 'brand__name', 'city')
    inlines = [ShowroomAmenityInline]
