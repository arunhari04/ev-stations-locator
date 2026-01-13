from django.contrib import admin
from .models import Station, Favorite, Operator, Amenity, Charger, StationImage, ChargerType, StationCharger

class ChargerInline(admin.TabularInline):
    model = Charger
    extra = 1


class StationImageInline(admin.TabularInline):
    model = StationImage
    extra = 1

@admin.register(ChargerType)
class ChargerTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'connector_type', 'max_power_kw')

@admin.register(StationCharger)
class StationChargerAdmin(admin.ModelAdmin):
    list_display = ('station', 'charger_type', 'start_price', 'end_price', 'is_available')
    list_filter = ('charger_type', 'station')
    search_fields = ('station__name', 'charger_type__name')

@admin.register(StationImage)
class StationImageAdmin(admin.ModelAdmin):
    list_display = ('station', 'image_url')
    search_fields = ('station__name',)

@admin.register(Operator)
class OperatorAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_email')

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name',)

class StationChargerInline(admin.TabularInline):
    model = StationCharger
    extra = 1

@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'operator')
    list_filter = ('status', 'operator')
    search_fields = ('name', 'address')
    inlines = [StationChargerInline, ChargerInline, StationImageInline]

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'station', 'created_at')
