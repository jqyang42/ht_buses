# create bus entry when log is created
# close a log api
# bus that are active
from ...models import Bus, Location
from ...serializers import BusSerializer, LocationSerializer


def active_buses():
    data = {}
    buses = Bus.objects.filter(is_running=True)
    bus_serializer = BusSerializer(buses, many=True)
    bus_arr = []
    for bus in bus_serializer.data:
        bus_number = bus["number"]
        location_serializer = LocationSerializer(Location.objects.get(pk=bus["location_id"]), many=False)
        bus_lat = location_serializer.data["lat"]
        bus_lng = location_serializer.data["lng"]
        bus_arr.append({'bus_number': bus_number, 'lat': bus_lat, 'lng': bus_lng})
    data["buses"] = bus_arr
    return bus_arr

def bus_location_update(bus_number, lat, lng):
    bus_obj = Bus.objects.filter(bus_number=bus_number)
    bus_obj[0].location_id.lat = lat
    bus_obj[0].location_id.lng = lng
    bus_obj[0].location_id.save()

