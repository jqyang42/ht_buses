from ...models import User, Student, Route, School
from ...constants import constants
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from . import announcement_tools
from django.conf import settings
from ...role_permissions import IsAdmin, IsSchoolStaff
from ..general.general_tools import has_access_to_object, get_role_string, filtered_users_helper
from ..general import response_messages

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin])
def announcement_users(request):
    data={}
    subject, body, include_route_info = announcement_tools.email_request_parser(request.data)
    try:
        sender_role = get_role_string(request.user.role)
        recipients = User.objects.filter(role=4)
        data = announcement_tools.send_mass_announcement(sender_role, subject, body, recipients, include_route_info)
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "sending user announcement")

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin|IsSchoolStaff])
def announcement_school(request):
    data = {}
    subject, body, include_route_info = announcement_tools.email_request_parser(request.data)
    try:
        id = request.query_params["id"]
        uv_school_id = School.objects.get(pk=id)
    except:
        return response_messages.DoesNotExist(data, "school")
    try:
        school_id = has_access_to_object(request.user, uv_school_id)
    except:
        return response_messages.PermissionDenied(data, "school")
    try:
        sender_role = get_role_string(request.user.role)
        recipients = User.objects.filter(role=4, student_id__school_id=id)
        data = announcement_tools.send_mass_announcement(sender_role, subject, body, recipients, include_route_info)
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "sending school announcement")

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdmin|IsSchoolStaff])
def announcement_route(request):
    data = {}
    subject, body, include_route_info = announcement_tools.email_request_parser(request.data)
    try:
        id = request.query_params["id"]
        uv_route_id = Route.objects.get(pk=id)
    except:
        return response_messages.DoesNotExist(data, "route")
    route_id = has_access_to_object(request.user, uv_route_id)
    try:
        route_id = has_access_to_object(request.user, uv_route_id)
    except:
        return response_messages.PermissionDenied(data, "route")
    try:
        sender_role = get_role_string(request.user.role)
        recipients = User.objects.filter(role=4, student_id__route_id=id)
        data = announcement_tools.send_mass_announcement(sender_role, subject, body, recipients, include_route_info)
        return Response(data)
    except:
        return response_messages.UnsuccessfulAction(data, "sending route announcement")

