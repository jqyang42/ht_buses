from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response
import re
from ..resources import capitalize_reg

# Students PUT API
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def student_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    new_first_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["student"]["first_name"])
    new_last_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["student"]["last_name"])
    student_school_id = reqBody["student"]["student_school_id"]
    try:
        og_student_object = Student.studentsTable.get(pk = id) 
    except: 
        data["message"] = "student was not found, update was unsucessful"
        data["success"] = False
        return Response(data, status = 404)
    try:
        school_id = School.schoolsTable.get(pk=reqBody["student"]["school_id"])
        user_id = User.objects.get(pk = reqBody["student"]["user_id"]) 
        og_student_object.last_name = new_last_name
        og_student_object.first_name = new_first_name
        og_student_object.school_id = school_id
        og_student_object.student_school_id = student_school_id
        og_student_object.user_id = user_id
        og_student_object.in_range = reqBody["student"]["in_range"]
    except:
        data["message"] = "invalid options were chosen. update was unsuccessful"
        data["success"] = False
        return Response(data)
    try: 
        og_student_object.route_id = Route.routeTables.get(pk=reqBody["student"]["route_id"])
    except: 
        og_student_object.route_id = None
    og_student_object.save()
    data["message"] = "student information successfully updated"
    data["student"] = {"first_name": new_first_name, "last_name": new_last_name, "student_school_id": student_school_id, "route_id": reqBody["student"]["route_id"], "user_id": user_id.id}
    data["success"] = True
    return Response(data)