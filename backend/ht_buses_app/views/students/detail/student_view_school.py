from ....models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import  AllowAny
from rest_framework.response import Response
from ....serializers import StudentSerializer, RouteSerializer, SchoolSerializer, UserSerializer
from django.core.paginator import Paginator
from ..student_pagination import student_pagination
from ....role_permissions import IsAdmin, IsSchoolStaff, IsDriver
from ...general.general_tools import get_students_for_user

# Students Table: School Detail GET API
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def students_school(request):
    data = {}
    page_number = request.query_params["page"]
    school_id = request.query_params["id"]
    students = get_students_for_user(request.user).filter(school_id=school_id).order_by("id")
    data = student_pagination(students, page_number)
    return Response(data)