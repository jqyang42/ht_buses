from ...serializers import SchoolSerializer, LocationSerializer
from ...models import School, Location
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
import re
from ..resources import capitalize_reg
from datetime import datetime

# Schools PUT API
# Refactor to be a PUT request
@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdminUser])
def school_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        school_object =  School.schoolsTable.get(pk = id)
        school_object.name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["school"]["name"])
        school_object.arrival = datetime.time(datetime.strptime(reqBody["school"]["arrival"], "%I:%M %p"))
        school_object.departure = datetime.time(datetime.strptime(reqBody["school"]["departure"], "%I:%M %p"))
        school_object.location_id.address = reqBody["school"]["location"]["address"]
        school_object.location_id.lat = reqBody["school"]["location"]["lat"]
        school_object.location_id.long = reqBody["school"]["location"]["long"]
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