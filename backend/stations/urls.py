from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StationViewSet, FavoriteViewSet, 
    nearby_stations, search_stations, filter_stations, station_options,
    map_home, map_station_detail, map_search
)

router = DefaultRouter()
# /api/favorites -> standard router
router.register(r'favorites', FavoriteViewSet, basename='favorite')
# /api/stations/{id} -> standard router mostly, but we have specific listing paths differently.
# We can keep router for convenience of CRUD/Detail on /stations/ID
router.register(r'stations', StationViewSet, basename='station')

urlpatterns = [
    # Custom Station APIs
    path('stations/nearby/', nearby_stations, name='station_nearby'),
    path('stations/search/', search_stations, name='station_search'),
    path('stations/filter/', filter_stations, name='station_filter'),
    path('stations/options/', station_options, name='station_options'),
    
    # Map APIs
    path('map/home/', map_home, name='map_home'),
    path('map/station/<int:pk>/', map_station_detail, name='map_station_detail'),
    path('map/search/', map_search, name='map_search'),
    
    # Favorites custom separate routing if needed (e.g. /api/favorites/add)
    # The default router gives /favorites/ (list/create).
    # Prompt asks for: POST /api/favorites/add, DELETE /api/favorites/remove
    # We can map those specifically to viewset actions actions.
    path('favorites/add', FavoriteViewSet.as_view({'post': 'add'}), name='favorite_add'),
    path('favorites/remove', FavoriteViewSet.as_view({'delete': 'remove'}), name='favorite_remove'),
    
    path('', include(router.urls)),
]
