from django.db import models
from django.conf import settings

class Operator(models.Model):
    name = models.CharField(max_length=255)
    contact_email = models.CharField(max_length=255, blank=True, null=True)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Amenities"

    def __str__(self):
        return self.name

class Station(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        MAINTENANCE = 'MAINTENANCE', 'Maintenance'
        OFFLINE = 'OFFLINE', 'Offline'

    name = models.CharField(max_length=255)
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    
    operator = models.ForeignKey(Operator, on_delete=models.CASCADE, related_name='stations')
    
    opening_hours = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    
    amenities = models.ManyToManyField(Amenity, related_name='stations', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class StationImage(models.Model):
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='images')
    image_url = models.TextField()

    def __str__(self):
        return f"Image for {self.station.name}"

class Charger(models.Model):
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='chargers')
    charger_type = models.CharField(max_length=50, help_text="DC, AC, CCS, CHAdeMO")
    power_kw = models.FloatField()
    price_per_kwh = models.FloatField()

    def __str__(self):
        return f"{self.charger_type} ({self.power_kw}kW) at {self.station.name}"

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'station')

    def __str__(self):
        return f"{self.user} -> {self.station}"
