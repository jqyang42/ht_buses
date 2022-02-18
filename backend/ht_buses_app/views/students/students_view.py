from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer, UserSerializer

# Students GET API: All Students for Admin
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdminUser]) 
def students(request):
    data = {}
    # COMMENTED OUT CODE FOR PAGINATION
    #page_number = request.query_params["page"]
    # For now I will retrieve 10 records for each page request, can be changed
    # if int(page_number) == 1:
    #     students = Student.studentsTable.all()[:10*int(page_number)]
    # else:
    #     students = Student.studentsTable.all()[1+10*(int(page_number)-1):10*int(page_number)]
    students = Student.studentsTable.all()
    student_serializer = StudentSerializer(students, many=True)
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
        school = School.schoolsTable.get(pk=student["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        school_name = school_serializer.data["name"]
        in_range = student["in_range"]
        if student["route_id"] == None:
            route = 0
            route_arr = {"id": 0, "color_id": 0}
        else:
            route = Route.routeTables.get(pk=student["route_id"])
            route_serializer = RouteSerializer(route, many=False)
            route_arr = {"name": route_serializer.data["name"], "color_id": route_serializer.data["color_id"]}
        student_list.append({'id' : id, 'student_school_id' : student_school_id, 'first_name' : first_name, 'last_name' : last_name, 'school_name' : school_name, 'route' : route_arr, 'in_range': in_range, 'parent' : parent_name})
    data["students"] = student_list
    data["success"] = True
    return Response(data)