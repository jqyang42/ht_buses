from ...models import School, Route, Student, Location, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from ...serializers import LocationSerializer, StudentSerializer, RouteSerializer, SchoolSerializer
from ..stops import check_in_range

@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated]) 
def parent_student_detail(request):
    data = {}
    id = request.query_params["id"]
    try:
        student = Student.studentsTable.get(pk=id)
        auth_string = "Token "+str(student.user_id.auth_token)
        if auth_string == request.headers['Authorization']:
            data["student"] = student_arr_data(student)
            data["success"] = True
            return Response(data)
        else: 
            data["route"] = {'name' : '', 'description' : ''}
            data["success"] = False
            data["message"] = {"User is not authorized to see this page"}
            return Response(data, status = 404)
    except:
        data["success"] = False
        return Response(data, status = 404)

def student_arr_data(student):
    student_arr = {}
    student_serializer = StudentSerializer(student, many=False)
    student_arr["school_student_id"] = student_serializer.data["student_school_id"]
    student_arr["first_name"] = student_serializer.data["first_name"]
    student_arr["last_name"] = student_serializer.data["last_name"]
    school = School.schoolsTable.get(pk=student_serializer.data["school_id"])
    school_serializer = SchoolSerializer(school, many=False)
    student_arr["school_name"] = school_serializer.data["name"]
    user = User.objects.get(pk=student_serializer.data["user_id"])
    location_serializer = LocationSerializer(user.location, many=False)
    location_arr = {"id": location_serializer.data["id"], "address": location_serializer.data["address"],
    "lat": location_serializer.data["lat"], "long": location_serializer.data["long"]}
    if student_serializer.data["route_id"] == None:
        route_arr = {"id": 0,"name":"Unassigned","description":"N/A","color_id": 0}
    else:
        route = Route.routeTables.get(pk=student_serializer.data["route_id"])
        route_serializer = RouteSerializer(route, many=False)
        route_name = route_serializer.data["name"]
        route_description = route_serializer.data["description"]
        route_arr = {'id': route_serializer.data["id"], 'name' : route_name, 'description' : route_description, 'color_id': route_serializer.data['color_id']}
    student_arr["route"] = route_arr
    student_arr["stops"] = check_in_range.check_student_in_range(student_serializer.data["user_id"], student_serializer.data["route_id"])
    student_arr["location"] = location_arr
    return student_arr