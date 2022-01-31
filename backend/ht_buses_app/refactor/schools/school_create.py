from ...models import School
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response

# Schools POST API
@api_view(["POST"])
@permission_classes([IsAdminUser]) 
def school_create(request):
    data = {}
    reqBody = json.loads(request.body)
    name = reqBody['school_name']
    address = reqBody['school_address']
    School.schoolsTable.create(name=name, address = address)
    data["message"] = "school created successfully"
    result = {"data" : data}
    return Response(result)