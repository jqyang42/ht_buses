from ...models import School, Route, User, Student
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer, UserSerializer
from django.core.paginator import Paginator
from . student_account import get_students_phone, get_students_email

def student_pagination(students, page_number):
    data = {}
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
        parent_name = {'id': parent_serializer.data["id"], 'first_name' : parent_first, 'last_name' : parent_last, 'phone_number': parent_serializer.data["phone_number"]}
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
        try:
            student_object = Student.objects.get(pk = id)
            student_email = get_students_email(student_object)
            student_phone = get_students_phone(student_object)
        except:
            student_email = ''
            student_phone = ''
        student_list.append({'id' : id, 'student_school_id' : student_school_id, 'first_name' : first_name, 'last_name' : last_name, 'school_name' : school_name, 'route' : route_arr, 'in_range': in_range, 'email': student_email, 'phone_number': student_phone, 'parent' : parent_name})
    data["students"] = student_list
    data["page"] = {"current_page": page_number, "can_prev_page": prev_page, "can_next_page": next_page, "total_pages": total_page_num}
    data["success"] = True
    return data

