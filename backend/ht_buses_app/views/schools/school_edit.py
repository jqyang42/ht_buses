from ...serializers import SchoolSerializer
from ...models import School
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response
import re
from ..resources import capitalize_reg

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
        school_object.address = reqBody["school"]["location"]["address"]
        school_object.lat = reqBody["school"]["location"]["lat"]
        school_object.long = reqBody["school"]["location"]["long"]
        school_object.save()
        data["message"] = "school information updated successfully"
        school_serializer = SchoolSerializer(school_object, many=False)
        data["school"] = school_serializer.data
        return Response(data)
    except:
        data["message"] = "school could not be updated"
        return Response(data, status = 400)