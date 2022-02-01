from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response

@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def user_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    user_object = User.objects.get(pk=id)
    user_object.email = reqBody['email']
    user_object.first_name = reqBody['first_name']
    user_object.last_name = reqBody['last_name']
    user_object.address = reqBody['address']
    user_object.lat = reqBody['lat']
    user_object.long = reqBody['long']
    user_object.is_parent = reqBody['is_parent']
    user_object.is_staff = reqBody['is_staff']
    user_object.save()
    # if user_object.is_parent is True:
    #     for student_info in reqBody["students"]:
    #         create_student(student_info, id)
    data["message"] = "User and associated students updated successfully"
    result = {"data" : data}
    return Response(result)

def create_student(student_info, id=None):
    data = {}
    first_name = student_info['first_name']
    last_name = student_info['last_name']
    student_school_id = student_info['student_school_id']
    try:
        user_id = User.objects.get(pk = id)
        school_id = School.schoolsTable.get(id =student_info['school_id'])
    except :
        data["message"] = "Invalid options were chosen. Student information update was unsuccessful"
        result = {"data" : data}
        return Response(result)
    try:
        route_id = Route.routeTables.get(pk = student_info['route_id'])
        student = Student.studentsTable.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user_id, student_school_id=student_school_id, route_id=route_id)
    except:
        route_id = None
        student = Student.studentsTable.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user_id, student_school_id=student_school_id, route_id = route_id)
    data["message"] = "student created successfully"
    data["student"] = {"first_name": first_name, "last_name": last_name, "student_school_id": student_school_id, "route_id": str(student.route_id), "user_id": user_id.id}
    result = {"data" : data}
    return Response(result) 