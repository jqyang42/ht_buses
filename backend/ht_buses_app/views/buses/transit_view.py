from ...models import School, Location, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from ...serializers import LocationSerializer, SchoolSerializer
from django.core.paginator import Paginator
from ...role_permissions import IsAdmin,IsSchoolStaff, IsDriver
from guardian.shortcuts import get_objects_for_user
from . import transit_updates
from . import bus_management
import time

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def transit_fetch(request):
    data = {'buses':[]}
    if not transit_updates.is_running:
        active_buses = bus_management.active_buses()
        transit_updates.initialize_updater(active_buses=active_buses)
        # transit_updates.add_bus(4001)

    coords = bus_management.active_buses()
    for bus in coords:
        data.get("buses").append({
            "bus_number" : bus.get('bus_number'),
            "location": {
                "lat": bus.get("lat"),
                "lng": bus.get("lng")
            }
        })
    print(data)
    return Response(data)