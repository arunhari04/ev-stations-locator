from django.urls import path
from .views import (
    RegisterView, ProfileView, LogoutView, 
    ForgotPasswordView, ResetPasswordView, 
    LocationUpdateView, LocationCurrentView,
    EmailTokenObtainPairView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    
    path('profile/', ProfileView.as_view(), name='user_profile'),
    
    # Location Endpoints (Consolidated)
    path('location/update/', LocationUpdateView.as_view(), name='location_update'),
    path('location/current/', LocationCurrentView.as_view(), name='location_current'),
]
