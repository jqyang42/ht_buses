from ...models import School
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response
import re
from ..resources import capitalize_reg

# Schools POST API
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdminUser]) 
def school_create(request):
    data = {}
    reqBody = json.loads(request.body)
    name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody['school_name'])
    address = reqBody['school_address']
    lat = reqBody['lat']
    long = reqBody['long']
    school = School.schoolsTable.create(name=name, address=address, lat=lat, long=long)
    data["message"] = "school created successfully"
    data["school"] = {'id' : school.id}
    result = {"data" : data}
    return Response(result)