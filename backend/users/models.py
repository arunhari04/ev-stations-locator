from django.contrib.auth.models import AbstractUser
from django.db import models

class UserLocation(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE, related_name='userlocation')
    latitude = models.FloatField()
    longitude = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Location for {self.user.username}"

class User(AbstractUser):
    email = models.EmailField(unique=True)
    profile_image = models.URLField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    # User Preferences
    is_dark_mode = models.BooleanField(default=False)
    allow_location_tracking = models.BooleanField(default=True)
    
    # Favorites will be a reverse relation from FavoriteStation model, 
    # but we can add a helper or M2M if needed later. 
    # For now, keeping it simple.

    def __str__(self):
        return self.username
