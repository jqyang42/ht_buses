from ...models import Student
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import json
from rest_framework.response import Response
from django.core.exceptions import ValidationError

# Student DELTE API
@permission_classes([IsAdminUser])
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def student_delete(request):
    data = {}
    reqBody = json.loads(request.body)
    try:
        student_object =  Student.studentsTable.filter(student_school_id = reqBody['student_school_id'])[0]
        student_object.delete()
        data["message"] = "student successfully deleted"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "student could not be deleted"})