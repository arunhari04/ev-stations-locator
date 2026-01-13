from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserLocation

class UserLocationInline(admin.StackedInline):
    model = UserLocation
    can_delete = False
    verbose_name_plural = 'Location'

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email')
    inlines = (UserLocationInline,)
    fieldsets = UserAdmin.fieldsets + (
        ('Profile', {'fields': ('profile_image', 'phone_number')}),
    )
