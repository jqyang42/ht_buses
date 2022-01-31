from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from django.core.exceptions import ValidationError
from rest_framework.response import Response

# Students PUT API
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def student_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    new_first_name = reqBody['first_name']
    new_last_name = reqBody['last_name']
    student_school_id = reqBody['student_school_id']
    try:
        school_id = School.schoolsTable.filter(name=reqBody["school_name"])[0]
        route_id = Route.routeTables.filter(name = reqBody["route_name"])[0]
        parent = reqBody['parent']
        user_id = User.objects.filter(first_name = parent["first_name"], last_name = parent["last_name"], email = parent["email"])[0]
        og_student_object = Student.studentsTable.get(pk = id)   
        og_student_object.last_name = new_last_name
        og_student_object.first_name = new_first_name
        og_student_object.school_id = school_id
        og_student_object.student_school_id = student_school_id
        og_student_object.route_id  = route_id
        og_student_object.user_id = user_id
        og_student_object.save()
        data["message"] = "Student information successfully updated"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "invalid options were chosen"})