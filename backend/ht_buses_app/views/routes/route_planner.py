from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer, UserSerializer

# Route Planner API
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdminUser])
def routeplanner(request):
    data = {}
    id = request.query_params["id"] # This is the school id
    try:
        school = School.schoolsTable.get(pk=id)
        school_serializer = SchoolSerializer(school, many=False)
        data["name"] = school_serializer.data["name"]
        data["address"] = school_serializer.data["address"]
        data["lat"] = school_serializer.data["lat"]
        data["long"] = school_serializer.data["long"]
        routes = Route.routeTables.filter(school_id=id)
        routes_serializer = RouteSerializer(routes, many=True)
        routes_arr = []
        for route in routes_serializer.data:
            route_id = route["id"]
            name = route["name"]
            routes_arr.append({'id' : route_id, 'name' : name})
            data["routes"] = routes_arr
        students = Student.studentsTable.filter(school_id=id)
        student_serializer = StudentSerializer(students, many=True)
        address_arr = []
        parent_id_arr = []
        for student in student_serializer.data:
            parent_id = student["user_id"]
            parent = User.objects.get(pk=parent_id)
            if parent_id not in parent_id_arr:
                parent_id_arr.append(parent_id)
                parent_serializer = UserSerializer(parent, many=False)
                parent_student = Student.studentsTable.filter(user_id=parent_id, school_id=id)
                parent_student_serializer = StudentSerializer(parent_student, many=True)
                parent_student_arr = []
                for child in parent_student_serializer.data:
                    if child["route_id"] == None:
                        parent_student_arr.append({'id' : child["id"], 'first_name': child["first_name"], 'last_name': child["last_name"], 'route_id' : 0})
                    else:
                        parent_student_arr.append({'id' : child["id"], 'first_name': child["first_name"], 'last_name': child["last_name"], 'route_id' : child["route_id"]})
                address_arr.append({'id' : student["user_id"], 'address' : parent_serializer.data["address"], 'lat': parent_serializer.data["lat"], 'long': parent_serializer.data["long"], 'students': parent_student_arr})
        data["parents"] = address_arr
        return Response(data)
    except:
        return Response(data, status = 404)
