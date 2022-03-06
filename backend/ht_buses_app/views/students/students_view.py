from ...models import Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat 
from .student_pagination import student_pagination
from ...role_permissions import IsAdmin, IsSchoolStaff, IsDriver

# Students GET API: All Students for Admin
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def students(request):
    page_number = request.query_params["page"]
    order_by = request.query_params["order_by"]
    sort_by = request.query_params["sort_by"] # will look for asc or desc
    search = request.query_params["q"]
    data = get_student_view(page_number, order_by, sort_by, search)
    return Response(data)

def get_student_view(page_number, order_by, sort_by, search):
    students = student_search_and_sort(order_by, sort_by, search)
    data = student_pagination(students, page_number)
    return data

def student_search_and_sort(order_by, sort_by, search):
    if sort_by == "name":
        sort_by = "first_name"
    if sort_by == "route":
        sort_by = "route_id__name"
    if sort_by == "parent":
        sort_by = "user_id__first_name"
    if sort_by == "school_name":
        sort_by = "school_id__name"
    
    # search only
    if (sort_by == "" or sort_by == None) and (order_by == "" or order_by == None) and search != None:
        students = Student.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("id")
    else:
        if order_by == "asc":
            if search != None:
                students = Student.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
            .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by(sort_by)
            else:
                students = Student.objects.all().order_by(sort_by)
        else:
            if search != None:
                students = Student.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("-" + sort_by)
            else:
                students = Student.objects.all().order_by("-" + sort_by)
    return students