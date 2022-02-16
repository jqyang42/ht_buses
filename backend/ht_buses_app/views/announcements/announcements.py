from ...models import User, Student, Route, School
from ...constants import constants
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from . import announcement_tools
from django.conf import settings

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def announcement_users(request):
    data={}
    subject, body, include_route_info = email_tools.email_request_parser(request.data)
    try:
        recipients = User.objects.all()
        return email_tools.send_mass_announcement(subject, body, recipients, include_route_info)
    except:
        data["message"] = "no users found"
        data["success"] = False
        return Response(data, status = 404) 


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def announcement_school(request):
    data = {}
    subject, body, include_route_info = email_tools.email_request_parser(request.data)
    id = request.query_params["id"]
    try:
        school_id = School.schoolsTable.get(pk=id)
        students = Student.studentsTable.filter(school_id = school_id)
        recipients = email_tools.filtered_users_helper(students)
        return email_tools.send_mass_announcement(subject, body, recipients, include_route_info)
    except:
        data["message"] = "invalid school id"
        data["success"] = False
        return Response(data, status = 404) 

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def announcement_route(request):
    data = {}
    subject, body, include_route_info = email_tools.email_request_parser(request.data)
    id = request.query_params["id"]
    try:
        route_id = Route.routeTables.get(pk=id)
        students = Student.studentsTable.filter(route_id = route_id)
        recipients = email_tools.filtered_users_helper(students)
        return email_tools.send_mass_announcement(subject, body, recipients, include_route_info)
    except:
        data["message"] = "invalid route id"
        data["success"] = False
        return Response(data, status = 404)

