from ....models import Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat 
from ..student_pagination import student_pagination
from ....role_permissions import IsAdmin, IsSchoolStaff, IsDriver
from ...general.general_tools import get_students_for_user

# Students Table: User Detail GET API
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def students_user(request):
    data = {}
    page_number = request.query_params["page"]
    user_id = request.query_params["id"]
    search = request.query_params["q"]
    order_by = request.query_params["order_by"]
    sort_by = request.query_params["sort_by"] # will look for asc or desc
    students = student_search_and_sort(order_by, sort_by, search, user_id)
    data = student_pagination(students, page_number)
    return Response(data)

def student_search_and_sort(order_by, sort_by, search, user_id):
    if sort_by == "name":
        sort_by = "first_name"
    if sort_by == "route":
        sort_by = "route_id__name"
    if sort_by == "school_name":
        sort_by = "school_id__name"
    if sort_by == "email":
        sort_by = "account_id__email"
    
    students = Student.objects.filter(user_id = user_id)
    if (sort_by == "" or sort_by == None) and (order_by == "" or order_by == None) and search != None:
        students = students.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).filter(user_id=user_id).order_by("id")
    else:
        if order_by == "asc":
            if search != None:
                students = students.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
            .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).filter(user_id=user_id).order_by(sort_by)
            else:
                students = students.filter(user_id=user_id).order_by(sort_by)
        else:
            if search != None:
                students = students.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).filter(user_id=user_id).order_by("-" + sort_by)
            else:
                students = students.filter(user_id=user_id).order_by("-" + sort_by)
    return students