from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer

@csrf_exempt
@api_view(["GET"])
@permission_classes([AllowAny]) 
def parent_student_detail(request):
    data = {}
    student_arr = {}
    id = request.query_params["id"]
    try:
        print("do i get here")
        student = Student.studentsTable.get(pk=id)
        #auth_string = "Token "+str(student.user_id.auth_token)
        # request.headers['Authorization']
        auth_string = True
        if auth_string == True:
            print("do i get here")
            student_serializer = StudentSerializer(student, many=False)
            student_arr["school_student_id"] = student_serializer.data["student_school_id"]
            student_arr["first_name"] = student_serializer.data["first_name"]
            student_arr["last_name"] = student_serializer.data["last_name"]
            school = School.schoolsTable.get(pk=student_serializer.data["school_id"])
            school_serializer = SchoolSerializer(school, many=False)
            student_arr["school_name"] = school_serializer.data["name"]
            if student_serializer.data["route_id"] == None:
                route_name = "Unassigned"
                route_description = ""
            else:
                route = Route.routeTables.get(pk=student_serializer.data["route_id"])
                route_serializer = RouteSerializer(route, many=False)
                route_name = route_serializer.data["name"]
                route_description = route_serializer.data["description"]
            student_arr["route"] = {'name' : route_name, 'description' : route_description}
            data["student"] = student_arr
            return Response(data)
        else: 
            data["route"] = {'name' : '', 'description' : ''}
            data["message"] = {"User is not authorized to see this page"}
            return Response(data, status = 404)
    except:
        return Response(data, status = 404)