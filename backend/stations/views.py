from rest_framework import viewsets, permissions, filters, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes as api_permission_classes, action
from django.db.models import Q
from math import radians, cos, sin, asin, sqrt
from .models import Station, Favorite
from .serializers import StationSerializer, FavoriteSerializer

def haversine(lon1, lat1, lon2, lat2):
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 
    return c * r

@api_view(['GET'])
@api_permission_classes([permissions.AllowAny])
def station_options(request):
    # Get all unique charger types
    types = list(Station.objects.values_list('chargers__charger_type', flat=True).distinct())
    unique_types = sorted(list(set([t for t in types if t])))

    # Get all unique amenities
    amenities = list(Station.objects.values_list('amenities__name', flat=True).distinct())
    unique_amenities = sorted(list(set([a for a in amenities if a])))

    return Response({
        "charger_types": unique_types,
        "amenities": unique_amenities
    })


class StationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Station.objects.all()

@api_view(['GET'])
@api_permission_classes([permissions.AllowAny])
def nearby_stations(request):
    lat = request.query_params.get('lat') or request.query_params.get('latitude')
    lng = request.query_params.get('lng') or request.query_params.get('longitude')
    dist_param = request.query_params.get('distance', 10) # default 10km
    
    if not lat or not lng:
        if request.user.is_authenticated:
            try:
                ul = request.user.userlocation
                lat = ul.latitude
                lng = ul.longitude
            except:
                 pass
        
        if not lat or not lng:
            return Response({"error": "Latitude and Longitude required"}, status=400)
            
    lat = float(lat)
    lng = float(lng)
    limit_km = float(dist_param)
    
    stations = list(Station.objects.all())
    nearby = []
    for s in stations:
        d = haversine(lng, lat, s.longitude, s.latitude)
        if d <= limit_km:
            s.distance = d
            nearby.append(s)
    
    nearby.sort(key=lambda x: x.distance)
    serializer = StationSerializer(nearby, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@api_permission_classes([permissions.AllowAny])
def search_stations(request):
    query = request.query_params.get('q') or request.query_params.get('query')
    if not query:
        return Response([])
        
    stations = Station.objects.filter(name__icontains=query)
    serializer = StationSerializer(stations, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@api_permission_classes([permissions.AllowAny])
def filter_stations(request):
    queryset = Station.objects.all().prefetch_related('chargers', 'amenities', 'images', 'operator').distinct()
    
    # 1. Availability
    availability = request.query_params.get('availability')
    if availability == 'available':
        queryset = queryset.filter(status='ACTIVE')
    elif availability == '247':
        queryset = queryset.filter(opening_hours__icontains='24')

    # 2. Charger Type
    charger_type_param = request.query_params.get('charger_type')
    if charger_type_param:
        requested_types = [t.strip().lower() for t in charger_type_param.split(',') if t.strip()]
        q_objects = Q()
        for rt in requested_types:
            if rt == 'ac':
                q_objects |= Q(chargers__charger_type__icontains='AC') | Q(chargers__charger_type__icontains='Level 2')
            elif rt == 'dc':
                q_objects |= Q(chargers__charger_type__icontains='DC') | Q(chargers__charger_type__icontains='Fast') | Q(chargers__charger_type__icontains='CCS')
            elif rt == 'tesla':
                q_objects |= Q(chargers__charger_type__icontains='Tesla') | Q(chargers__charger_type__icontains='Supercharger')
            else:
                q_objects |= Q(chargers__charger_type__icontains=rt)
        
        if q_objects:
            queryset = queryset.filter(q_objects)

    # 3. Amenities
    amenities_param = request.query_params.get('amenities')
    if amenities_param:
        items = amenities_param.split(',')
        for item in items:
            item = item.strip()
            if not item: continue
            # Loose match for amenity name
            queryset = queryset.filter(amenities__name__icontains=item)

    # 5. Price (Filtering at DB level now possible!)
    price_min = request.query_params.get('price_min')
    price_max = request.query_params.get('price_max')
    
    if price_min:
        queryset = queryset.filter(chargers__price_per_kwh__gte=float(price_min))
    if price_max:
        queryset = queryset.filter(chargers__price_per_kwh__lte=float(price_max))

    # Convert to list for distance calc (cannot easily do geodistance in sqlite ORM without specialized libs)
    stations = list(queryset.distinct())

    # 4. Location & Distance
    lat = request.query_params.get('lat') or request.query_params.get('latitude')
    lng = request.query_params.get('lng') or request.query_params.get('longitude')
    
    dist_param = request.query_params.get('distance')
    limit_miles = float(dist_param) if dist_param else None

    # Fallback to user location
    if (not lat or not lng) and request.user.is_authenticated:
        try:
            ul = request.user.userlocation
            lat = ul.latitude
            lng = ul.longitude
        except:
            pass

    filtered_stations = []
    MILES_TO_KM = 1.60934

    for s in stations:
        # Distance Logic
        s.distance = None
        if lat and lng:
            try:
                user_lat = float(lat)
                user_lng = float(lng)
                kms = haversine(user_lng, user_lat, s.longitude, s.latitude)
                dist_miles = kms / MILES_TO_KM
                s.distance = dist_miles
            except (ValueError, TypeError):
                pass
        
        if limit_miles is not None and s.distance is not None:
             if s.distance > limit_miles:
                 continue
        
        filtered_stations.append(s)

    # 6. Sorting
    sort = request.query_params.get('sort')
    
    if sort == 'nearest':
        filtered_stations.sort(key=lambda x: x.distance if x.distance is not None else 999999)
    elif sort == 'cheapest':
        # Need to re-calculate min price for sorting since we don't have it annotated yet
        filtered_stations.sort(key=lambda x: min([c.price_per_kwh for c in x.chargers.all()] or [999]))
    elif sort == 'fastest':
        filtered_stations.sort(key=lambda x: max([c.power_kw for c in x.chargers.all()] or [0]), reverse=True)
        
    serializer = StationSerializer(filtered_stations, many=True, context={'request': request})
    return Response(serializer.data)


# Map APIs
from rest_framework import serializers
class MapStationSerializer(serializers.ModelSerializer):
    charger_types = serializers.SerializerMethodField()

    class Meta:
        model = Station
        fields = ['id', 'name', 'latitude', 'longitude', 'charger_types', 'status']

    def get_charger_types(self, obj):
        return list(obj.chargers.values_list('charger_type', flat=True).distinct())

@api_view(['GET'])
@api_permission_classes([permissions.AllowAny])
def map_home(request):
    stations = Station.objects.all()
    serializer = MapStationSerializer(stations, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@api_permission_classes([permissions.AllowAny])
def map_station_detail(request, pk):
    try:
        station = Station.objects.get(pk=pk)
    except Station.DoesNotExist:
        return Response(status=404)
    serializer = MapStationSerializer(station)
    return Response(serializer.data)

@api_view(['GET'])
@api_permission_classes([permissions.AllowAny])
def map_search(request):
    query = request.query_params.get('q')
    if not query:
        return Response([])
    stations = Station.objects.filter(name__icontains=query)
    serializer = MapStationSerializer(stations, many=True)
    return Response(serializer.data)


class FavoriteViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FavoriteSerializer

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')

        # Fallback to user profile location if query param missing
        if (not lat or not lng) and request.user.is_authenticated:
            try:
                ul = request.user.userlocation
                lat = ul.latitude
                lng = ul.longitude
            except:
                pass

        results = list(queryset)

        if lat and lng:
            try:
                user_lat = float(lat)
                user_lng = float(lng)
                
                for fav in results:
                    station = fav.station
                    d = haversine(user_lng, user_lat, station.longitude, station.latitude)
                    # Hack: Attach distance to the station instance so serializer finds it
                    station.distance = d
            except (ValueError, TypeError):
                pass

        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        return self.create(request)
    
    @action(detail=False, methods=['delete'])
    def remove(self, request):
        station_id = request.data.get('station_id')
        Favorite.objects.filter(user=request.user, station_id=station_id).delete()
        return Response(status=204)
