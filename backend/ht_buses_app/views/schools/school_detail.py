from multiprocessing import allow_connection_pickling
from ...models import School, Route, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ...serializers import SchoolSerializer, RouteSerializer, StudentSerializer, LocationSerializer
from ...role_permissions import IsAdmin, IsSchoolStaff, IsDriver
from ..general.general_tools import has_access_to_object
from ..general import response_messages
# Schools Detail GET API
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAdmin|IsSchoolStaff|IsDriver]) 
def schools_detail(request):
    data = {}
    id = request.query_params["id"]
    try :
        uv_school = School.objects.get(pk=id)
    except:
        return response_messages.DoesNotExist(data, "school")
    try:
        school = has_access_to_object(request.user, uv_school)
    except:
        return response_messages.PermissionDenied(data, "school")
    try:
        school_serializer = SchoolSerializer(school, many=False)
        students = Student.objects.filter(school_id=id)
        students_serializer = StudentSerializer(students, many=True)
        route = Route.objects.filter(school_id=id)
        route_serializer = RouteSerializer(route, many=True)
        location_serializer = LocationSerializer(school.location_id, many=False)
        school_arr = {"name": school_serializer.data["name"], "arrival": school_serializer.data["arrival"][:-3], "departure": school_serializer.data["departure"][:-3], "location": location_serializer.data}
        data["school"] = school_arr
        student_list = []
        for student in students_serializer.data:
            if student["route_id"] == None:
                route_id = 0
                route_arr = {"id": 0, "color_id": 0}
            else:
                route_id = student["route_id"]
                student_route = Route.objects.get(pk=route_id)
                student_route_serializer = RouteSerializer(student_route, many=False)
                route_arr = {"id": student["route_id"], "name": student_route_serializer.data["name"], "color_id": student_route_serializer.data["color_id"]}
            student_list.append({'id': student["id"], 'student_school_id': student["student_school_id"], 'first_name': student["first_name"], 'last_name' : student["last_name"], 'route': route_arr, 'in_range': student["in_range"]})
        data["students"] = student_list
        route_list = []
        for school_route in route_serializer.data:
            route_count = Student.objects.filter(route_id=Route.objects.get(pk=school_route["id"]))
            route_count_serialize = StudentSerializer(route_count, many=True)
            route_list.append({'id': school_route["id"], 'name': school_route["name"], 'student_count': len(route_count_serialize.data), "is_complete": school_route["is_complete"]})
        data["routes"] = route_list
        data["success"] = True
        return Response(data)
    except:
       return response_messages.UnsuccessfulAction(data, "school")
