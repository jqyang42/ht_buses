from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response

# User POST API
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdminUser])
def user_create(request):
    data = {}
    reqBody = json.loads(request.body)
    email = reqBody['email']
    password = reqBody['password']
    first_name = reqBody['first_name']
    last_name = reqBody['last_name']
    address = reqBody['address']
    is_staff = reqBody['is_staff']
    is_parent = reqBody['is_parent']
    lat = reqBody['lat']
    long = reqBody['long']
    if is_staff: 
        user = User.objects.create_superuser(email=email, first_name=first_name, last_name=last_name, is_parent= is_parent, password=password, address=address, lat=lat, long=long)
    else:
        user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, is_parent= is_parent, address= address, password=password, lat=lat, long=long)
    if is_parent:
        for student in reqBody["students"]:
            create_students(student, user.id)
    data["message"] = "User created successfully"
    result = {"data" : data}
    return Response(result)
    

# Student Create
@permission_classes([IsAdminUser])
def create_students(request, user):
    data = {}
    reqBody = json.loads(request.body)
    user_id = user
    for student in reqBody['students']:
        first_name = student['first_name']
        last_name = student['last_name']
        school_id = School.schoolsTable.get(name=student["school_name"])
        student_school_id = student['student_school_id']
        if (student['route_name'] != None):
            route_id = Route.routeTables.get(name=student['route_name'])
            Student.studentsTable.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user_id, student_school_id=student_school_id, route_id = route_id)
        else:
            Student.studentsTable.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user_id, student_school_id=student_school_id, route_id = None)
    data["message"] = "students registered successfully"
    result = {"data" : data}
    return Response(result)

