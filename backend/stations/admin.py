from django.contrib import admin
from .models import Station, Favorite, Operator, Amenity, Charger, StationImage

class ChargerInline(admin.TabularInline):
    model = Charger
    extra = 1


class StationImageInline(admin.TabularInline):
    model = StationImage
    extra = 1

@admin.register(Charger)
class ChargerAdmin(admin.ModelAdmin):
    list_display = ('station', 'charger_type', 'power_kw')
    list_filter = ('charger_type',)
    search_fields = ('station__name', 'charger_type')

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

@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'operator')
    list_filter = ('status', 'operator')
    search_fields = ('name', 'address')
    inlines = [ChargerInline, StationImageInline]

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'station', 'created_at')
