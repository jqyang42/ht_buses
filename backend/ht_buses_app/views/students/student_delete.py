from ...models import Student
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import json
from rest_framework.response import Response
from django.core.exceptions import ValidationError

# Student DELETE API
@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def student_delete(request):
    data = {}
    id = request.query_params["id"]
    try:
        student_object =  Student.studentsTable.get(pk=id)
        student_object.delete()
        data["message"] = "student successfully deleted"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        return Response(data, status = 400)
        #raise ValidationError({"messsage": "student could not be deleted"})