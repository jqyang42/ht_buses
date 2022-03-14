from ...serializers import SchoolSerializer, LocationSerializer
from ...models import School, Location
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
import re
from ..resources import capitalize_reg
from datetime import datetime
from ...role_permissions import IsAdmin, IsSchoolStaff
from ..general.general_tools import get_object_for_user
from ..general import response_messages

# Schools Time PUT API
# Refactor to be a PUT request
@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdmin|IsSchoolStaff])
def school_edit_time(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        school_object =  School.objects.get(pk = id)
    except:
        return response_messages.DoesNotExist(data, "school")
    try:
        school_object = get_object_for_user(request.user, school_object, "change_school")
    except:
        return response_messages.PermissionDenied(data, "school")
    try:
        school_object.arrival = datetime.time(datetime.strptime(reqBody["school"]["arrival"], "%H:%M"))
        school_object.departure = datetime.time(datetime.strptime(reqBody["school"]["departure"], "%H:%M"))
        school_object.save()
        data["message"] = "school information updated successfully"
        data["success"] = True
        location_serializer = LocationSerializer(school_object.location_id, many=False)
        data["school"] = {"id": school_object.id, "name": school_object.name, "arrival": school_object.arrival, "departure": school_object.departure, "location": location_serializer.data}
        return Response(data)
    except:
        return response_messages.UnsuccessfulChange(data, "school")