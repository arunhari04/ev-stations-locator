from django.db import models
from django.conf import settings

class Operator(models.Model):
    name = models.CharField(max_length=255)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Amenities"

    def __str__(self):
        return self.name

class Place(models.Model):
    class PlaceType(models.TextChoices):
        CHARGING = "CHARGING", "Charging Station"
        SHOWROOM = "SHOWROOM", "Showroom"
        SERVICE = "SERVICE", "Service Shop"

    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        MAINTENANCE = 'MAINTENANCE', 'Maintenance'
        OFFLINE = 'OFFLINE', 'Offline'

    name = models.CharField(max_length=255)
    place_type = models.CharField(max_length=30, choices=PlaceType.choices)
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    
    operator = models.ForeignKey(Operator, on_delete=models.SET_NULL, null=True, blank=True, related_name='places')
    
    opening_hours = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    
    # Changed from ManyToManyField to JSONField
    amenities = models.ManyToManyField(Amenity, related_name='places', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.place_type})"

class PlaceImage(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='images')
    image_url = models.TextField()

    def __str__(self):
        return f"Image for {self.place.name}"

class ChargerType(models.Model):
    name = models.CharField(max_length=100, help_text="e.g. CCS2, Type 2, CHAdeMO")
    connector_type = models.CharField(max_length=50, help_text="Physical connector standard")
    max_power_kw = models.FloatField()

    def __str__(self):
        return f"{self.name} ({self.max_power_kw}kW)"

class PlaceCharger(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='place_chargers')
    charger_type = models.ForeignKey(ChargerType, on_delete=models.CASCADE, related_name='place_links')
    
    # Station specific details for this type
    start_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    end_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_available = models.BooleanField(default=True)

    class Meta:
        unique_together = ('place', 'charger_type')

    def __str__(self):
        return f"{self.charger_type.name} at {self.place.name}"

class Charger(models.Model):
    # Represents a physical plug/unit
    place_charger = models.ForeignKey(PlaceCharger, on_delete=models.CASCADE, related_name='units', null=True)
    # Kept place for backward compatibility if needed, but ideally we access via place_charger
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='chargers') 
    
    def __str__(self):
        return f"Unit for {self.place_charger}"

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'place')

    def __str__(self):
        return f"{self.user} -> {self.place}"
