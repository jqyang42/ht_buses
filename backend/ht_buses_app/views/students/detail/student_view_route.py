from ....models import Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import  AllowAny
from rest_framework.response import Response
from ..student_pagination import student_pagination
from ....role_permissions import IsAdmin, IsSchoolStaff, IsDriver
from ...general.general_tools import get_students_for_user

# Students Table: Route Detail GET API
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def students_route(request):
    data = {}
    page_number = request.query_params["page"]
    route_id = request.query_params["id"]
    students = get_students_for_user(request.user).filter(route_id=route_id).order_by("id")
    data = student_pagination(students, page_number)
    return Response(data)