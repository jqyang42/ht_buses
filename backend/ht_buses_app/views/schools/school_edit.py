from ...models import School
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response

# Schools PUT API
@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdminUser])
def school_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        school_object =  School.schoolsTable.get(pk = id)
        school_object.name = reqBody['school_name'].capitalize()
        school_object.address = reqBody['school_address']
        school_object.lat = reqBody['lat']
        school_object.long = reqBody['long']
        school_object.save()
        data["message"] = "school information updated successfully"
        result = {"data" : data}
        return Response(result)
    except:
        data["message"] = "School could not be updated "
        result = {"data" : data}
        return Response(result, status = 400)