from django.contrib import admin
from .models import Place, Favorite, Operator, Amenity, Charger, PlaceImage, ChargerType, PlaceCharger

class ChargerInline(admin.TabularInline):
    model = Charger
    extra = 1

class PlaceImageInline(admin.TabularInline):
    model = PlaceImage
    extra = 1

@admin.register(ChargerType)
class ChargerTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'connector_type', 'max_power_kw')

@admin.register(PlaceCharger)
class PlaceChargerAdmin(admin.ModelAdmin):
    list_display = ('place', 'charger_type', 'start_price', 'end_price', 'is_available')
    list_filter = ('charger_type', 'place')
    search_fields = ('place__name', 'charger_type__name')

@admin.register(PlaceImage)
class PlaceImageAdmin(admin.ModelAdmin):
    list_display = ('place', 'image_url')
    search_fields = ('place__name',)

@admin.register(Operator)
class OperatorAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_email', 'website')

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name',)

class PlaceChargerInline(admin.TabularInline):
    model = PlaceCharger
    extra = 1

@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'place_type', 'operator')
    list_filter = ('status', 'place_type', 'operator')
    search_fields = ('name', 'address')
    inlines = [PlaceChargerInline, ChargerInline, PlaceImageInline]

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'place', 'created_at')
