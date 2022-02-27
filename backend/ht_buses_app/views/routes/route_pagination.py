from ...models import School, Student
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer
from django.core.paginator import Paginator

def route_pagination(routes, page_number):
    data = {}
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
    return data
