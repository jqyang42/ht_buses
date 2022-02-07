from ...models import School, Route, Student
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from ...serializers import SchoolSerializer, RouteSerializer, StudentSerializer

# Schools Detail GET API
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny]) 
def schools_detail(request):
    data = {}
    id = request.query_params["id"]
    try :
        school = School.schoolsTable.get(pk=id)
        school_serializer = SchoolSerializer(school, many=False)
        students = Student.studentsTable.filter(school_id=id)
        students_serializer = StudentSerializer(students, many=True)
        route = Route.routeTables.filter(school_id=id)
        route_serializer = RouteSerializer(route, many=True)
        location_arr = {"address": school_serializer.data["address"]}
        school_arr = {"name": school_serializer.data["name"], "location": location_arr}
        data["school"] = school_arr
        student_list = []
        for student in students_serializer.data:
            if student["route_id"] == None:
                route_id = 0
                route_name = "Unassigned"
            else:
                route_id = student["route_id"]
                student_route = Route.routeTables.get(pk=route_id)
                student_route_serializer = RouteSerializer(student_route, many=False)
                route_name = student_route_serializer.data["name"]
            student_list.append({'id': student["id"], 'student_school_id': student["student_school_id"], 'first_name': student["first_name"], 'last_name' : student["last_name"], 'route_name': route_name})
        if len(student_list) != 0:
            data["students"] = student_list
        route_list = []
        for school_route in route_serializer.data:
            route_count = Student.studentsTable.filter(route_id=Route.routeTables.get(pk=school_route["id"]))
            route_count_serialize = StudentSerializer(route_count, many=True)
            route_list.append({'id': school_route["id"], 'name': school_route["name"], 'student_count': len(route_count_serialize.data)})
        if len(route_list) != 0:
            data["routes"] = route_list
        return Response(data)
    except:
        data["message"] = "school could not be found"
        return Response(data, status = 404)