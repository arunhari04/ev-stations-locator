from rest_framework import serializers
from .models import Station, Favorite

class StationSerializer(serializers.ModelSerializer):
    distance = serializers.FloatField(read_only=True, required=False)
    is_favorite = serializers.SerializerMethodField()
    is_fast_charging = serializers.BooleanField(read_only=True)
    navigation_url = serializers.SerializerMethodField()

    operator = serializers.StringRelatedField() # Show operator name
    charger_types = serializers.SerializerMethodField()
    amenities = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    power_kw = serializers.SerializerMethodField() # Max power
    price = serializers.SerializerMethodField() # Formatting helper
    available_count = serializers.SerializerMethodField()

    class Meta:
        model = Station
        fields = [
            'id', 'name', 'address', 'latitude', 'longitude', 
            'operator', 'opening_hours', 'status', 'created_at',
            'charger_types', 'amenities', 'images', 'power_kw', 'price',
            'distance', 'is_favorite', 'is_fast_charging', 'navigation_url',
            'available_count'
        ]

    def get_available_count(self, obj):
        return obj.chargers.count()

    def get_charger_types(self, obj):
        # Return unique list of charger types
        return list(obj.chargers.values_list('charger_type', flat=True).distinct())

    def get_amenities(self, obj):
        return list(obj.amenities.values_list('name', flat=True))

    def get_images(self, obj):
        return list(obj.images.values_list('image_url', flat=True))

    def get_power_kw(self, obj):
        # Return max power available or 0
        from django.db.models import Max
        return obj.chargers.aggregate(Max('power_kw'))['power_kw__max'] or 0.0

    def get_price(self, obj):
        # Return formatted price range or single price
        from django.db.models import Min, Max
        stats = obj.chargers.aggregate(Min('price_per_kwh'), Max('price_per_kwh'))
        min_p = stats['price_per_kwh__min']
        max_p = stats['price_per_kwh__max']
        if min_p is None:
            return "N/A"
        if min_p == max_p:
            return f"${min_p:.2f}/kWh"
        return f"${min_p:.2f} - ${max_p:.2f}/kWh"

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.favorites.filter(station=obj).exists()
        return False

    def get_navigation_url(self, obj):
        return f"https://www.google.com/maps/search/?api=1&query={obj.latitude},{obj.longitude}"

class FavoriteSerializer(serializers.ModelSerializer):
    station = StationSerializer(read_only=True)
    station_id = serializers.PrimaryKeyRelatedField(
        queryset=Station.objects.all(), source='station', write_only=True
    )

    class Meta:
        model = Favorite
        fields = ['id', 'station', 'station_id', 'created_at']
        
    def create(self, validated_data):
        user = self.context['request'].user
        station = validated_data['station']
        favorite, created = Favorite.objects.get_or_create(user=user, station=station)
        return favorite
