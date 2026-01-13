from django.test import TestCase
from rest_framework.test import APIClient
from .models import Station, Charger, Operator, Amenity

class StationFilterTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.op = Operator.objects.create(name="TestOp")
        
        self.station_ac = Station.objects.create(
            name="AC Station", 
            latitude=1.0, longitude=1.0, 
            operator=self.op
        )
        self.charger_ac = Charger.objects.create(
            station=self.station_ac, charger_type="AC", power_kw=22, price_per_kwh=0.20, status='AVAILABLE'
        )

        self.station_dc = Station.objects.create(
            name="DC Station", 
            latitude=1.1, longitude=1.1, 
            operator=self.op
        )
        self.charger_dc = Charger.objects.create(
            station=self.station_dc, charger_type="DC", power_kw=50, price_per_kwh=0.30, status='IN_USE'
        )

    def test_filter_ac(self):
        response = self.client.get('/api/stations/filter/', {'charger_type': 'ac'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.station_ac.id)
        # Check available count
        self.assertEqual(response.data[0]['available_count'], 1)

    def test_filter_dc(self):
        response = self.client.get('/api/stations/filter/', {'charger_type': 'dc'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        # Check available count (should be 0 because status is IN_USE)
        self.assertEqual(response.data[0]['available_count'], 0)
