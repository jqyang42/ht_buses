from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import json
from rest_framework.response import Response
import re
from ..resources import capitalize_reg
from ..stops import check_in_range
from ..routes import route_check_is_complete
from ...role_permissions import IsAdmin, IsSchoolStaff
from ..general.general_tools import get_object_for_user
from ..general import response_messages

# Students PUT API
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAdmin|IsSchoolStaff])
def student_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    new_first_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["student"]["first_name"])
    new_last_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, reqBody["student"]["last_name"])
    student_school_id = reqBody["student"]["student_school_id"]
    try:
        student_object = Student.objects.get(pk = id) 
    except: 
        return response_messages.DoesNotExist(data, "student")
    try:
       school = get_object_for_user(request.user, School.objects.get(pk = reqBody["student"]["student_school_id"]), "change_school")
    except: 
        return response_messages.PermissionDenied(data, "student's new school")
    try:
        school_id = School.objects.get(pk=reqBody["student"]["school_id"])
        user_id = User.objects.get(pk = reqBody["student"]["user_id"]) 
        student_object.last_name = new_last_name
        student_object.first_name = new_first_name
        student_object.school_id = school_id
        student_object.student_school_id = student_school_id
        student_object.user_id = user_id
    except:
        return response_messages.UnsuccessfulAction(data, "student edit")
    try: 
        student_object.route_id = Route.objects.get(pk=reqBody["student"]["route_id"])
        stop_arr = check_in_range.check_student_in_range(reqBody["student"]["user_id"], reqBody["student"]["route_id"])
        if len(stop_arr) != 0:
            in_range = True
        else:
            in_range = False
        student_object.in_range = in_range
    except: 
        student_object.route_id = None
        student_object.in_range = False
    student_object.save()
    try:
        if student_object.route_id != None:
            student_route = Route.objects.get(pk=reqBody["student"]["route_id"])
            is_complete = route_check_is_complete.route_is_complete(reqBody["student"]["route_id"])
            student_route.is_complete = is_complete
            student_route.save()
        data["message"] = "student information successfully updated"
        data["student"] = {"first_name": new_first_name, "last_name": new_last_name, "student_school_id": student_school_id, "route_id": reqBody["student"]["route_id"], "user_id": user_id.id}
        data["success"] = True
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "student edit")
