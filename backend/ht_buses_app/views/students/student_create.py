# from pyparsing import empty
from ...serializers import StudentSerializer
from ...models import Student, School, User, Route
from rest_framework.response import Response
import re
from ..resources import capitalize_reg
from ..stops import check_in_range
from ..routes import route_check_is_complete
from ..accounts import account_tools, activate_account
from . student_account import create_student_account
from guardian.shortcuts import assign_perm


def create_student(student_info, id=None):
    data = {}
    first_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, student_info["first_name"])
    last_name = re.sub("(^|\s)(\S)", capitalize_reg.convert_to_cap, student_info["last_name"])
    student_school_id = student_info["student_school_id"]
    try:
        user = User.objects.get(pk=id)
        school_id = School.objects.get(id =student_info["school_id"])
    except :
        data["message"] = "invalid options were chosen, student information update was unsuccessful"
        data["success"] = False
        return data
    try:
        route_id = Route.objects.get(pk = student_info['route_id'])
        student = Student.objects.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user, student_school_id=student_school_id, route_id=route_id)
        stop_arr = check_in_range.check_student_in_range(id, student_info['route_id'])
        if len(stop_arr) != 0:
            in_range = True
        else:
            in_range = False
        student.in_range = in_range
        student.save()
        is_complete = route_check_is_complete.route_is_complete(student_info["route_id"])
        route_id.is_complete = is_complete
        route_id.save()
    except:
        route_id = None
        student = Student.objects.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user, student_school_id=student_school_id, route_id = route_id)
        student.in_range = False
        student.save()
    data["message"] = "student created successfully"
    try:
        student_email = student_info["email"]
    except:
        student_email = ""
    if student_email != "":
        student_account_data = create_student_account(student, student_email)
        if not student_account_data["success"]:
            data["message"] = "student created successfully but account was not created"
    user.save()
    data["success"] = True
    data["student"] = {"first_name": first_name, "last_name": last_name, "student_school_id": student_school_id, "route_id": str(student.route_id), "user_id": user.id}
    return data