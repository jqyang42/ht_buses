from ...models import Route, School, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from ...serializers import StudentSerializer, RouteSerializer, SchoolSerializer, UserSerializer

# Need to rethink logic, honestly not sure how to get rid of double for loop :(
@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdminUser])
def routes_detail(request):
    data = {}
    id = request.query_params["id"]
    try:
        route = Route.routeTables.get(pk=id)
        route_serializer = RouteSerializer(route, many=False)
        school = School.schoolsTable.get(pk=route_serializer.data["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        students = Student.studentsTable.filter(route_id=id)
        students_serializer = StudentSerializer(students, many=True)
        route_address = {"lat": school_serializer.data["lat"], "long": school_serializer.data["long"]}
        route_school = {"id" : route_serializer.data["school_id"], "name" : school_serializer.data["name"], "location": route_address}
        route_arr = {"name": route_serializer.data["name"], "school": route_school, "description": route_serializer.data["description"]}
        parent_id_arr = []
        address_arr = []
        for student in students_serializer.data:
            parent_student_arr = []
            parent_id = student["user_id"]
            parent = User.objects.get(pk=parent_id)
            if parent_id not in parent_id_arr:
                parent_id_arr.append(parent_id)
                parent_serializer = UserSerializer(parent, many=False)
                parent_student = Student.studentsTable.filter(user_id=parent_id, route_id=id)
                parent_student_serializer = StudentSerializer(parent_student, many=True)
                for child in parent_student_serializer.data:
                    parent_student_arr.append({"id" : child["id"], "student_school_id": child["student_school_id"], "first_name": child["first_name"], "last_name" : child["last_name"]})
                parent_address = {"address": parent_serializer.data["address"], "lat": parent_serializer.data["lat"], "long": parent_serializer.data["long"]}
                address_arr.append({"id" : parent_id, "location" : parent_address, "students": parent_student_arr})
        data["route"] = route_arr
        if len(address_arr) != 0:
            data["parents"] = address_arr
        return Response(data, status = 200)
    except:
        data["message"] = "route was not found"
        return Response(data, status = 404)

