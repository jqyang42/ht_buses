from ...models import School
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response
from django.core.exceptions import ValidationError

# Schools PUT API
@api_view(["PUT"])
@permission_classes([IsAdminUser])
def school_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        school_object =  School.schoolsTable.get(pk=id)
        school_object.name = reqBody['school_name']
        school_object.address = reqBody['school_address']
        school_object.save()
        data["message"] = "school information updated successfully"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "school cannot be edited because it does not exist"})