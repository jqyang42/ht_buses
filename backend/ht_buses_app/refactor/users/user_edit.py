from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from django.core.exceptions import ValidationError
from rest_framework.response import Response

@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def user_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    user_object = User.objects.get(pk = id)
    user_object.email = reqBody['email']
    user_object.first_name = reqBody['first_name']
    user_object.last_name = reqBody['last_name']
    user_object.address = reqBody['address']
    user_object.is_parent = reqBody['is_parent']
    user_object.is_staff = reqBody['is_staff']
    user_object.save()
    if user_object.is_parent is True:
        for student_info in reqBody["students"]:
            edit_or_create_student(student_info, id)
    data["message"] = "User and associated students updated successfully"
    result = {"data" : data}
    return Response(result)

def edit_or_create_student(student_info,id=None):
    data = {}
    first_name = student_info['first_name']
    last_name = student_info['last_name']
    student_school_id = student_info['student_school_id']
    try:
        user_id = User.objects.get(pk = id)
        route_id = Route.routeTables.filter(name = student_info['route_name'])[0]
        school_id = School.schoolsTable.filter(name =student_info['school_name'])[0]

    except BaseException as e:
        raise ValidationError({"messsage": "Invalid options were chosen"})
    try: 
        student_object = Student.studentsTable.filter(student_school_id = student_school_id, user_id = user_id)[0] # Need to have something that doesn't change
        student_object.first_name = first_name
        student_object.last_name = last_name
        student_object.school_id = school_id
        student_object.student_school_id = student_school_id
        student_object.route_id = route_id
        student_object.save()
        data["message"] = "student updated successfully"
        result = {"data" : data}
        return Response(result) 
    except: 
        Student.studentsTable.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user_id, student_school_id=student_school_id, route_id=route_id)
        data["message"] = "student created successfully"
        result = {"data" : data}
        return Response(result) 