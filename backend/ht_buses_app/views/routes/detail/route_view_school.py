from ....models import School, Route, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from ....serializers import StudentSerializer, RouteSerializer, SchoolSerializer
from django.core.paginator import Paginator

# Routes GET API: All Routes View for Admin
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdminUser])
def routes_school(request):
    data = {}
    page_number = request.query_params["page"]
    school_id = request.query_params["id"]
    if int(page_number) == 0:
        prev_page = False
        next_page = False
        total_page_num = 0
        routes = Route.objects.filter(school_id=school_id).order_by("id")
        route_serializer = RouteSerializer(routes, many=True)
    else:
        routes = Route.objects.filter(school_id=school_id).order_by("id")
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
        school = School.objects.get(pk=route["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        school_name = school_serializer.data["name"]
        route_students = Student.objects.filter(route_id=id)
        student_serializer = StudentSerializer(route_students, many=True)
        student_count = len(student_serializer.data)
        school_obj = {'id' : route["school_id"], 'name': school_name}
        routes_filter.append({'id' : id, 'name' : name, 'school_name': school_obj, 'student_count': student_count, "is_complete": route["is_complete"], "color_id": route["color_id"]})
    data["routes"] = routes_filter
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return Response(data)