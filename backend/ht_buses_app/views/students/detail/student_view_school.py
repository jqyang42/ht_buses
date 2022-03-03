from ....models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import  AllowAny
from rest_framework.response import Response
from ....serializers import StudentSerializer, RouteSerializer, SchoolSerializer, UserSerializer
from django.core.paginator import Paginator
from ..student_pagination import student_pagination
from ....role_permissions import IsAdmin

# Students Table: School Detail GET API
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdmin]) 
def students_school(request):
    data = {}
    page_number = request.query_params["page"]
    school_id = request.query_params["id"]
    students = Student.objects.filter(school_id=school_id).order_by("id")
    data = student_pagination(students, page_number)
    return Response(data)