from ...models import Route, School, Student, User, Location
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ...serializers import LocationSerializer, StudentSerializer, RouteSerializer, SchoolSerializer, UserSerializer
from ...role_permissions import IsAdmin, IsSchoolStaff, IsDriver
from guardian.shortcuts import get_objects_for_user

@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver])
def routes_detail(request):
    data = {}
    id = request.query_params["id"]
    try:
        route = Route.objects.get(pk=id)
        route = get_objects_for_user(request.user, "view_video", route)
        route_serializer = RouteSerializer(route, many=False)
        school = School.objects.get(pk=route_serializer.data["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        students = Student.objects.filter(route_id=id)
        students_serializer = StudentSerializer(students, many=True)
        route_address = {"lat": school.location_id.lat, "lng": school.location_id.lng}
        route_school = {"id" : route_serializer.data["school_id"], "name" : school_serializer.data["name"], "location": route_address}
        route_arr = {"name": route_serializer.data["name"], "school": route_school, "description": route_serializer.data["description"], "is_complete": route_serializer.data["is_complete"], "color_id": route_serializer.data["color_id"]}
        parent_id_arr = []
        address_arr = []
        for student in students_serializer.data:
            parent_student_arr = []
            parent_id = student["user_id"]
            parent = User.objects.get(pk=parent_id)
            if parent_id not in parent_id_arr:
                parent_id_arr.append(parent_id)
                parent_student = Student.objects.filter(user_id=parent_id, route_id=id)
                parent_student_serializer = StudentSerializer(parent_student, many=True)
                for child in parent_student_serializer.data:
                    parent_student_arr.append({"id" : child["id"], "student_school_id": child["student_school_id"], "first_name": child["first_name"], "last_name" : child["last_name"],  "in_range": child["in_range"]})
                location = Location.objects.get(pk=parent.location_id)
                location_serializer = LocationSerializer(location, many=False)
                parent_address = {"address": location_serializer.data["address"], "lat": location_serializer.data["lat"], "lng": location_serializer.data["lng"]}
                address_arr.append({"id" : parent_id, "location" : parent_address, "students": parent_student_arr})
        data["route"] = route_arr
        data["users"] = address_arr
        data["success"] = True
        return Response(data)
    except:
        data["message"] = "route was not found"
        data["success"] = False
        return Response(data, status = 404)

