from ...models import Bus, Location
from ...serializers import BusSerializer, LocationSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ...role_permissions import IsAdmin, IsDriver, IsSchoolStaff

@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def get_bus(request):
    data = {}
    bus_number = request.query_params["bus_number"]
    bus_obj = Bus.objects.filter(bus_number=bus_number)
    if len(bus_obj) != 0:
        bus_serializer = BusSerializer(bus_obj[0], many=False)
        location = Location.objects.get(pk=bus_serializer.data["location_id"])
        location_serializer = LocationSerializer(location, many=False)
        data["bus"] = {"bus_number": bus_serializer.data["bus_number"], "lat": location_serializer.data["lat"], "lng": location_serializer.data["lng"]}
    else:
        data["bus"] = {}
    return Response(data)
