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
    data = {}
    if not transit_updates.is_running:
        transit_updates.update_buses()
        time.sleep(1.0)
    data = transit_updates.get_coords()
    return Response(data)