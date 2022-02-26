from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import json
from rest_framework.response import Response
from ....models import Student, Route, User, School
from django.core.paginator import Paginator
from ....serializers import StudentSerializer, UserSerializer, SchoolSerializer, RouteSerializer
from django.contrib.postgres.search import SearchVector, SearchQuery
from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat 

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdminUser]) 
def student_sort(request):
    order_by = request.query_params["order_by"] # Name, Route, School, Bus Stop, Parent Name
    sort_by = request.query_params["sort_by"] # will look for asc or desc
    page_num = request.query_params["page"]
    search = request.query_params["q"]
    # alphabetical sort
    if sort_by == "name" or sort_by == "route" or sort_by == "school_name" or sort_by == "in_range" or sort_by == "parent":
        data = alphabetical_sort(order_by, sort_by, page_num, search)
    
    # numerical sort
    if sort_by == "student_school_id":
        data = numerical_sort(order_by, page_num, search)

    return Response(data)

def alphabetical_sort(order_by, sort_by, page_number, search):
    data = {}
    if sort_by == "name":
        if order_by == "asc":
            if search != None:
                students = Student.studentsTable.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("first_name")
            else:
                students = Student.studentsTable.all().order_by("first_name")
        else:
            if search != None:
                students = Student.studentsTable.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("-first_name")
            else:
                students = Student.studentsTable.all().order_by("-first_name")
    if sort_by == "route":
        if order_by == "asc":
            if search != None:
                students = Student.studentsTable.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("route_id__name")
            else:
                students = Student.studentsTable.all().order_by("route_id__name")
        else:
            if search != None:
                students = Student.studentsTable.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("-route_id__name").annotate(search=SearchVector("student_school_id","first_name","last_name")).filter(search__icontains=search)
            else:
                students = Student.studentsTable.all().order_by("-route_id__name")
    if sort_by == "in_range":
        if order_by == "asc":
            if search != None:
                students = Student.studentsTable.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("-in_range")
            else:
                students = Student.studentsTable.all().order_by("-in_range")
        else:
            if search != None:
                students = Student.studentsTable.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("in_range")
            else:
                students = Student.studentsTable.all().order_by("in_range")
    if sort_by == "parent":
        if order_by == "asc":
            if search != None:
                students = Student.studentsTable.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("user_id__first_name")
            else:
                students = Student.studentsTable.all().order_by("user_id__first_name")
        else:
            if search != None:
                students = Student.studentsTable.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("-user_id__first_name")
            else:
                students = Student.studentsTable.all().order_by("-user_id__first_name")
    if sort_by == "school_name":
        if order_by == "asc":
            if search != None:
                students = Student.studentsTable.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("school_id__name")
            else:
                students = Student.studentsTable.all().order_by("school_id__name")
        else:
            if search != None:
                students = Student.studentsTable.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("-school_id__name")
            else:
                students = Student.studentsTable.all().order_by("-school_id__name")
    if int(page_number) == 0:
        prev_page = False
        next_page = False
        total_page_num = 0
        student_serializer = StudentSerializer(students, many=True)
    else:
        paginator = Paginator(students, 10) # Show 10 per page
        students_per_page = paginator.get_page(page_number)
        total_page_num = paginator.num_pages
        student_serializer = StudentSerializer(students_per_page, many=True)
        if int(page_number) == 1 and int(page_number) == total_page_num:
            prev_page = False
            next_page = False
        elif int(page_number) == 1:
            prev_page = False
            next_page = True
        else:
            prev_page = True
            if int(page_number) == total_page_num:
                next_page = False
            else:
                next_page = True
    student_list = []
    for student in student_serializer.data:
        id = student["id"]
        student_school_id = student["student_school_id"]
        first_name = student["first_name"]
        last_name = student["last_name"]
        parent = User.objects.get(pk=student["user_id"])
        parent_serializer = UserSerializer(parent, many=False)
        parent_first = parent_serializer.data["first_name"]
        parent_last = parent_serializer.data["last_name"]
        parent_name = {'id': parent_serializer.data["id"], 'first_name' : parent_first, 'last_name' : parent_last}
        school = School.objects.get(pk=student["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        school_name = school_serializer.data["name"]
        in_range = student["in_range"]
        if student["route_id"] == None:
            route = 0
            route_arr = {"id": 0, "color_id": 0}
        else:
            route = Route.objects.get(pk=student["route_id"])
            route_serializer = RouteSerializer(route, many=False)
            route_arr = {"id": student["route_id"], "name": route_serializer.data["name"], "color_id": route_serializer.data["color_id"]}
        student_list.append({'id' : id, 'student_school_id' : student_school_id, 'first_name' : first_name, 'last_name' : last_name, 'school_name' : school_name, 'route' : route_arr, 'in_range': in_range, 'parent' : parent_name})
    data["students"] = student_list
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return data

def numerical_sort(order_by, page_number, search):
    data = {}
    if order_by == "asc":
        if search != None:
            students = Student.studentsTable.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("student_school_id")
        else:
            students = Student.studentsTable.all().order_by("student_school_id")
    else:
        if search != None:
            students = Student.studentsTable.annotate(full_name=Concat('first_name', V(' '), 'last_name'))\
        .filter(Q(full_name__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(student_school_id__icontains = search)).order_by("-student_school_id")
        else:
            students = Student.studentsTable.all().order_by("-student_school_id")
    if int(page_number) == 0:
        prev_page = False
        next_page = False
        total_page_num = 0
        student_serializer = StudentSerializer(students, many=True)
    else:
        paginator = Paginator(students, 10) # Show 10 per page
        students_per_page = paginator.get_page(page_number)
        total_page_num = paginator.num_pages
        student_serializer = StudentSerializer(students_per_page, many=True)
        if int(page_number) == 1 and int(page_number) == total_page_num:
            prev_page = False
            next_page = False
        elif int(page_number) == 1:
            prev_page = False
            next_page = True
        else:
            prev_page = True
            if int(page_number) == total_page_num:
                next_page = False
            else:
                next_page = True
    student_list = []
    for student in student_serializer.data:
        id = student["id"]
        student_school_id = student["student_school_id"]
        first_name = student["first_name"]
        last_name = student["last_name"]
        parent = User.objects.get(pk=student["user_id"])
        parent_serializer = UserSerializer(parent, many=False)
        parent_first = parent_serializer.data["first_name"]
        parent_last = parent_serializer.data["last_name"]
        parent_name = {'id': parent_serializer.data["id"], 'first_name' : parent_first, 'last_name' : parent_last}
        school = School.objects.get(pk=student["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        school_name = school_serializer.data["name"]
        in_range = student["in_range"]
        if student["route_id"] == None:
            route = 0
            route_arr = {"id": 0, "color_id": 0}
        else:
            route = Route.objects.get(pk=student["route_id"])
            route_serializer = RouteSerializer(route, many=False)
            route_arr = {"id": student["route_id"], "name": route_serializer.data["name"], "color_id": route_serializer.data["color_id"]}
        student_list.append({'id' : id, 'student_school_id' : student_school_id, 'first_name' : first_name, 'last_name' : last_name, 'school_name' : school_name, 'route' : route_arr, 'in_range': in_range, 'parent' : parent_name})
    data["students"] = student_list
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return data