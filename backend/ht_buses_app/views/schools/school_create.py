from ...models import School, Location
from ...serializers import LocationSerializer, SchoolSerializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import  AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
import re
from ..resources import capitalize_reg
from datetime import datetime
from ...role_permissions import IsAdmin
from ..general.response_messages import UnsuccessfulAction
# Schools POST API
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin]) 
def school_create(request):
    data = {}
    try:
        reqBody = json.loads(request.body)
        name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["school"]["name"])
        address = reqBody["school"]["location"]["address"]
        lat = reqBody["school"]["location"]["lat"]
        lng = reqBody["school"]["location"]["lng"]
        arrival = reqBody["school"]["arrival"]
        departure = reqBody["school"]["departure"]
        location = Location.objects.create(address=address, lat=lat, lng=lng)
        school = School.objects.create(name=name, location_id=location, arrival=datetime.time(datetime.strptime(arrival,"%H:%M")), departure=datetime.time(datetime.strptime(departure, "%H:%M")))
        location_serializer = LocationSerializer(location, many=False)
        data["message"] = "school created successfully"
        data["success"] = True
        data["school"] = {"id": school.id, "name": name, "arrival": school.arrival, "departure": school.departure, "location": location_serializer.data}
        return Response(data)
    except:
        return UnsuccessfulAction(data, "school create")