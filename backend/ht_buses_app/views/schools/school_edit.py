from ...serializers import SchoolSerializer, LocationSerializer
from ...models import School, Location, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import  AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
from ...role_permissions import IsSchoolStaff
import re
from ..resources import capitalize_reg
from datetime import datetime
from django.contrib.auth.decorators import permission_required
from guardian.shortcuts import assign_perm
from guardian.shortcuts import get_objects_for_user
from ...role_permissions import IsAdmin, IsSchoolStaff
from ..general.general_tools import get_object_for_user

 
@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdmin|IsSchoolStaff]) 
def school_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        uv_school_object =  School.objects.get(pk = id)
        school_object = get_object_for_user(request.user, uv_school_object, "change_school")
        school_object.name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["school"]["name"])
        school_object.arrival = datetime.time(datetime.strptime(reqBody["school"]["arrival"], "%H:%M"))
        school_object.departure = datetime.time(datetime.strptime(reqBody["school"]["departure"], "%H:%M"))
        school_object.location_id.address = reqBody["school"]["location"]["address"]
        school_object.location_id.lat = reqBody["school"]["location"]["lat"]
        school_object.location_id.lng = reqBody["school"]["location"]["lng"]
        school_object.location_id.save()
        school_object.save()
        data["message"] = "school information updated successfully"
        data["success"] = True
        location_serializer = LocationSerializer(school_object.location_id, many=False)
        data["school"] = {"id": school_object.id, "name": school_object.name, "arrival": school_object.arrival, "departure": school_object.departure, "location": location_serializer.data}
        return Response(data)
    except:
        data["message"] = "school could not be updated"
        data["success"] = False
        return Response(data, status = 400)