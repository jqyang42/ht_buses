from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from ....models import School, Location, Route, Student
from django.core.paginator import Paginator
from ....serializers import SchoolSerializer, LocationSerializer, RouteSerializer, StudentSerializer
from django.contrib.postgres.search import SearchVector, SearchQuery
from django.db.models import Count

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdminUser]) 
def route_sort(request):
    order_by = request.query_params["order_by"] # Name, Route, School, Bus Stop, Parent Name
    sort_by = request.query_params["sort_by"] # will look for asc or desc
    page_num = request.query_params["page"]
    search = request.query_params["q"]
    is_search = request.query_params["search"]
    # alphabetical sort
    if sort_by == "name" or sort_by == "school" or sort_by == "is_complete":
        data = alphabetical_sort(is_search, order_by, sort_by, page_num, search)
    
    # numerical sort
    if sort_by == "student_count":
        data = numerical_sort(sort_by, order_by, page_num, search)

    return Response(data)

def alphabetical_sort(is_search, order_by, sort_by, page_number, search):
    data = {}
    if sort_by == "name":
        if order_by == "asc":
            if is_search == "true":
                routes = Route.routeTables.filter(name__icontains=search).order_by("name")
            else:
                routes = Route.routeTables.all().order_by("name")
                #Route.routeTables.all().order_by("name")
        else:
            if is_search == "true":
                routes = Route.routeTables.filter(name__icontains=search).order_by("-name")
            else:
                routes = Route.routeTables.all().order_by("-name")
    if sort_by == "school":
        if order_by == "asc":
            if is_search == "true":
                routes = Route.routeTables.filter(name__icontains=search).order_by("school_id__name")
            else:
                routes = Route.routeTables.all().order_by("school_id__name")
                print(routes)
        else:
            if is_search == "true":
                routes = Route.routeTables.filter(name__icontains=search).order_by("-school_id__name")
            else:
                routes = Route.routeTables.all().order_by("-school_id__name")
    if sort_by == "is_complete":
        if order_by == "asc":
            if is_search == "true":
                routes = Route.routeTables.filter(name__icontains=search).order_by("-is_complete")
            else:
                routes = Route.routeTables.all().order_by("-is_complete")
        else:
            if is_search == "true":
                routes = Route.routeTables.filter(name__icontains=search).order_by("is_complete")
            else:
                routes = Route.routeTables.all().order_by("is_complete")
    if int(page_number) == 0:
        prev_page = False
        next_page = False
        total_page_num = 0
        route_serializer = RouteSerializer(routes, many=True)
    else:
        paginator = Paginator(routes, 10) # Show 10 per page
        routes_per_page = paginator.get_page(page_number)
        total_page_num = paginator.num_pages
        route_serializer = RouteSerializer(routes_per_page, many=True)
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
    routes_filter = []
    for route in route_serializer.data:
        id = route["id"]
        name = route["name"]
        school = School.schoolsTable.get(pk=route["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        school_name = school_serializer.data["name"]
        route_students = Student.studentsTable.filter(route_id=id)
        student_serializer = StudentSerializer(route_students, many=True)
        student_count = len(student_serializer.data)
        school_obj = {'id' : route["school_id"], 'name': school_name}
        routes_filter.append({'id' : id, 'name' : name, 'school_name': school_obj, 'student_count': student_count, "is_complete": route["is_complete"], "color_id": route["color_id"]})
    data["routes"] = routes_filter
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return data

def numerical_sort(is_search, sort_by, order_by, page_number, search):
    data = {}
    if sort_by == "student_count":
        if order_by == "asc":
            if is_search == "true":
                routes = Route.routeTables.filter(name__icontains=search).order_by('student_count')
            else:
                routes = Route.routeTables.filter(student_count=Count('student')).order_by('student_count')
                print(routes)
        else:
            if is_search == "true":
                routes = Route.routeTables.filter(name__icontains=search).order_by('-student_count')
            else:
                routes = Route.routeTables.filter(student_count=Count('student')).order_by('-student_count')
    if int(page_number) == 0:
        prev_page = False
        next_page = False
        total_page_num = 0
        #routes = Route.routeTables.all().order_by("id")
        route_serializer = RouteSerializer(routes, many=True)
    else:
        #routes = Route.routeTables.all().order_by("id")
        paginator = Paginator(routes, 10) # Show 10 per page
        routes_per_page = paginator.get_page(page_number)
        total_page_num = paginator.num_pages
        route_serializer = RouteSerializer(routes_per_page, many=True)
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
    routes_filter = []
    for route in route_serializer.data:
        id = route["id"]
        name = route["name"]
        school = School.schoolsTable.get(pk=route["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        school_name = school_serializer.data["name"]
        route_students = Student.studentsTable.filter(route_id=id)
        student_serializer = StudentSerializer(route_students, many=True)
        student_count = len(student_serializer.data)
        school_obj = {'id' : route["school_id"], 'name': school_name}
        routes_filter.append({'id' : id, 'name' : name, 'school_name': school_obj, 'student_count': student_count, "is_complete": route["is_complete"], "color_id": route["color_id"]})
    data["routes"] = routes_filter
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return data