from ...models import School
from ...serializers import SchoolSerializer
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
    try:
        reqBody = json.loads(request.body)
        name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["school"]["name"])
        address = reqBody["school"]["location"]["address"]
        lat = reqBody["school"]["location"]["lat"]
        long = reqBody["school"]["location"]["long"]
        school = School.schoolsTable.create(name=name, address=address, lat=lat, long=long)
        school_serializer = SchoolSerializer(school, many=False)
        data["message"] = "school created successfully"
        data["school"] = school_serializer.data
        return Response(data)
    except:
        data["message"] = "school could not be created"
        return Response(data, status = 400)