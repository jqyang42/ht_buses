from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
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
        school_address = {"address": school.location_id.address, "lat": school.location_id.lat, "long": school.location_id.long}
        school_arr = {"name": school_serializer.data["name"], "location": school_address} 
        data["school"] = school_arr
        routes = Route.routeTables.filter(school_id=id)
        routes_serializer = RouteSerializer(routes, many=True)
        routes_arr = []
        for route in routes_serializer.data:
            route_id = route["id"]
            name = route["name"]
            is_complete = route["is_complete"]
            color_id = route["color_id"]
            routes_arr.append({"id" : route_id, "name" : name, "is_complete": is_complete, "color_id": color_id})
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
                parent_student = Student.studentsTable.filter(user_id=parent_id, school_id=id)
                parent_student_serializer = StudentSerializer(parent_student, many=True)
                parent_student_arr = []
                for child in parent_student_serializer.data:
                    if child["route_id"] == None:
                        parent_student_arr.append({"id" : child["id"], "first_name": child["first_name"], "last_name": child["last_name"], "route_id" : 0, "in_range": child["in_range"]})
                    else:
                        parent_student_arr.append({"id" : child["id"], "first_name": child["first_name"], "last_name": child["last_name"], "route_id" : child["route_id"], "in_range": child["in_range"]})
                parent_address = {"address": parent.location.address, "lat": parent.location.lat, "long": parent.location.long}
                address_arr.append({"id" : student["user_id"], "location": parent_address, "students": parent_student_arr})
        data["users"] = address_arr
        data["success"] = True
        return Response(data)
    except:
        data["message"] = "school is invalid"
        data["success"] = False
        return Response(data, status = 404)
