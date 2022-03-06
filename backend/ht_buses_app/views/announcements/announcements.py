from ...models import User, Student, Route, School
from ...constants import constants
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from . import announcement_tools
from django.conf import settings
from ...role_permissions import IsAdmin, IsSchoolStaff
from ..general.general_tools import get_object_for_user

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin])
def announcement_users(request):
    data={}
    subject, body, include_route_info = announcement_tools.email_request_parser(request.data)
    try:
        recipients = User.objects.all()
        data = announcement_tools.send_mass_announcement(subject, body, recipients, include_route_info)
        return Response(data)
    except:
        data["message"] = "no users found"
        data["success"] = False
        return Response(data, status = 404) 


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin|IsSchoolStaff])
def announcement_school(request):
    data = {}
    subject, body, include_route_info = announcement_tools.email_request_parser(request.data)
    try:
        id = request.query_params["id"]
        uv_school_id = School.objects.get(pk=id)
        school_id = get_object_for_user(request.user, uv_school_id, "change_school")
        students = Student.objects.filter(school_id = school_id)
        recipients = announcement_tools.filtered_users_helper(students)
        data = announcement_tools.send_mass_announcement(subject, body, recipients, include_route_info)
        return Response(data)
    except:
        data["message"] = "invalid school id"
        data["success"] = False
        return Response(data, status = 404) 

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin|IsSchoolStaff])
def announcement_route(request):
    data = {}
    subject, body, include_route_info = announcement_tools.email_request_parser(request.data)
    try:
        id = request.query_params["id"]
        uv_route_id = Route.objects.get(pk=id)
        route_id = get_object_for_user(request.user, uv_route_id, "change_route")
        students = Student.objects.filter(route_id = route_id)
        recipients = announcement_tools.filtered_users_helper(students)
        data = announcement_tools.send_mass_announcement(subject, body, recipients, include_route_info)
        return Response(data)
    except:
        data["message"] = "invalid route id"
        data["success"] = False
        return Response(data, status = 404)

