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
import time

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def transit_fetch(request):
    data = {"buses": []}
    if not transit_updates.is_running:
        print("not running yet")
        transit_updates.add_bus(4001)
        transit_updates.start_updating()
        time.sleep(1.0)
    coords = transit_updates.get_coords()
    for key, value in coords.items():
        data["buses"].append({
            "bus_id" : key,
            "location": {
                "lat": value["lat"],
                "lng": value["lng"]
            }
        })
    return Response(data)