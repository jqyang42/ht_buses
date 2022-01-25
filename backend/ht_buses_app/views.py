from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.authtoken.models import Token
from .models import School, Route, Student, User, UserManager
from django.contrib.auth import authenticate
from django.contrib.auth import login, logout
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import json
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from .serializers import StudentSerializer, RouteSerializer, SchoolSerializer, UserSerializer

@api_view(["POST"])
@permission_classes([AllowAny]) 
def User_login(request):
    data = {}
    reqBody = json.loads(request.body)
    email = reqBody['email']
    password = reqBody['password']
    try:
        user = User.objects.get(email=email)
    except BaseException as e:
        raise ValidationError({"message": 'Account does not exist'})
    if not check_password(password, user.password):
        raise ValidationError({"message": 'Incorrect password'})
    if user: 
        token = Token.objects.get_or_create(user=user)[0].key
        login(request._request, user,backend = 'ht_buses_app.authenticate.AuthenticationBackend')
        data["message"] = "user registered successfully"
        data["email"] = user.email
        result = {"data": data, "token":token}
        return Response(result)
    else: 
        raise ValidationError({"message": "Account does not exist"})

# User Creation API
# Needs to be changed to IsAuthenticated
@api_view(["POST"])
@permission_classes([AllowAny]) 
def signup(request):
    data = {}
    reqBody = json.loads(request.body)
    email = reqBody['email']
    password = reqBody['password']
    first_name = reqBody['first_name']
    last_name = reqBody['last_name']
    address = reqBody['address']
    is_staff = reqBody['is_staff']
    is_parent = reqBody['is_parent']
    if is_staff: 
        user = User.objects.create_superuser(email=email, first_name=first_name, last_name=last_name, is_parent= is_parent, password=password, address= address)
    else:
        user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, is_parent= is_parent, password=password, address= address)
    if is_parent:
        student_create(request, user)
    data["message"] = "User created successfully"
    result = {"data" : data}
    return Response(result)

# Student Create
def student_create(request, user):
    data = {}
    reqBody = json.loads(request.body)
    user_id = user
    for student in reqBody['students']:
        first_name = student['first_name']
        last_name = student['last_name']
        school_id = School.schoolsTable.get(name=student["school"])
        student_school_id = student['student_school_id']
        route_id = Route.routeTables.get(name=student['route'])
        student_object = Student.studentsTable.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user_id, student_school_id=student_school_id, route_id=route_id)
    data["message"] = "student registered successfully"
    result = {"data" : data}
    return

# Students Detail API
@api_view(["GET"])
# Needs to be changed to IsAuthenticated
@permission_classes([AllowAny])
def students_detail(request):
    data = {}
    reqBody = json.loads(request.body)
    # Cannot be tested, need API for creating a parent
    Student.studentsTable.create(first_name="Mary", last_name="Jane", school_id=School.schoolsTable.get(pk=1), student_school_id=3,route_id=Route.routeTables.get(pk=1),user_id=User.objects.get(pk=1))
    student = Student.studentsTable.get(pk=reqBody["student"]["id"])
    student_serializer = StudentSerializer(student, many=False)
    route = Route.routeTables.get(pk=student_serializer.data["route_id"])
    route_serializer = RouteSerializer(route, many=False)
    school = School.schoolsTable.get(pk=student_serializer.data["school_id"])
    school_serializer = SchoolSerializer(school, many=False)
    data["first_name"] = student_serializer.data["first_name"]
    data["last_name"] = student_serializer.data["last_name"]
    data["school"] = school_serializer.data["name"]
    data["route"] = route_serializer.data["name"]
    return Response(data)

# Logout API
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def User_logout(request):
    request.user.auth_token.delete()
    logout(request._request)
    return Response('User Logged out successfully')  

def students(request, logged_in=False, user = None):
    if logged_in and user is not None:
        if user.is_staff:
            dictionary =  {'all_students': Student.studentsTable.all(), 'user_first': user.first_name, 'user_last': user.last_name}
            return render(request, 'students.html', dictionary)
        else: 
            dictionary =  {'all_students': Student.studentsTable.all(), 'user_first': user.first_name, 'user_last': user.last_name}
            return render(request, 'students.html', dictionary)
    else: 
        return render(request, 'index.html', {}) #change to login page if not logged in 
    
def students_edit(request):
    return render(request, 'students_edit.html', {})

def schools(request):
    return render(request, 'schools.html', {})

@api_view(['GET'])
@permission_classes([AllowAny]) 
def api_schools(request):
    if request.method == 'GET':
        schools = School.schoolsTable.all()

        # name = request.GET.get('title', None)
        # if title is not None:
        #     schools = schools.filter etc etc
    schools_serializer = SchoolSerializer(schools, many=True)
    return JsonResponse(schools_serializer.data, safe=False)
    # return render(request, 'schools.html', {})

def schools_detail(request):
    data = {}
    reqBody = json.loads(request.body)
    try :
        school = School.schoolsTable.get(pk=reqBody["school"]["id"])
        school_serializer = SchoolSerializer(school, many=False)
        students = Student.studentsTable.filter(school_id=reqBody["school"]["id"])
        students_serializer = StudentSerializer(students, many=True)
        route = Route.routeTables.filter(school_id=reqBody["school"]["id"])
        route_serializer = RouteSerializer(route, many=True)
        data["name"] = school_serializer.data["name"]
        data["address"] = school_serializer.data["address"]
        student_list = []
        for student in students_serializer.data:
            id = student["id"]
            first_name = student["first_name"]
            last_name = student["last_name"]
            # need to do lookup on bus route
            route_id = student["route_id"]
            student_route = Route.routeTables.get(pk=route_id)
            student_route_serializer = RouteSerializer(student_route, many=False)
            route_name = student_route_serializer.data["name"]
            student_list.append({'id': id, 'first_name': first_name, 'last_name' : last_name, 'route_name': route_name})
        if len(student_list) != 0:
            data["students"] = student_list
        route_list = []
        for school_route in route_serializer.data:
            id = school_route["id"]
            name = school_route["name"]
            # need to find student count per route
            route_count = Student.studentsTable.filter(route_id=Route.routeTables.get(pk=id))
            route_count_serialize = StudentSerializer(route_count, many=True)
            student_count = len(route_count_serialize.data)
            route_list.append({'id': id, 'name': name, 'student_count': student_count})
        if len(route_list) != 0:
            data["routes"] = route_list
        return Response(data)
    except BaseException as e:
        raise ValidationError({"messsage": "School does not exist"})

@api_view(["POST"])
@permission_classes([AllowAny]) # TODO: change to IsAuthenticated once connected
def school_create(request):
    data = {}
    reqBody = json.loads(request.body)
    name = reqBody['school_name']
    address = reqBody['school_address']
    School.schoolsTable.create(name=name, address = address)
    data["message"] = "school created successfully"
    result = {"data" : data}
    return Response(result)

@api_view(["POST"])
@permission_classes([AllowAny]) # TODO: change to IsAuthenticated once connected
def school_edit(request):
    data = {}
    reqBody = json.loads(request.body)
    school_object =  School.schoolsTable.get(name = reqBody['previous_school_name'])
    new_name = reqBody['new_name']
    new_address = reqBody['new_address']
    school_object.name = new_name
    school_object.address = new_address
    school_object.save()
    data["message"] = "school edited successfully"
    result = {"data" : data}
    return Response(result)

@api_view(["POST"])
@permission_classes([AllowAny]) # TODO: change to IsAuthenticated once connected
def route_create(request):
    data = {}
    reqBody = json.loads(request.body)
    name = reqBody['route_name']
    school = School.schoolsTable.get(name = reqBody['school'])
    description = reqBody['route_description']
    Route.routeTables.create(name=name, school_id = school, description = description)
    data["message"] = "route created successfully"
    result = {"data" : data}
    return Response(result)

@api_view(["GET"])
@permission_classes([AllowAny]) # Needs to be changed to IsAuthenticated
def routes_detail(request):
    data = {}
    reqBody = json.loads(request.body)
    route = Route.routeTables.get(pk=reqBody["route"]["id"])
    route_serializer = RouteSerializer(route, many=False)
    school = School.schoolsTable.get(pk=route_serializer.data["school_id"])
    school_serializer = SchoolSerializer(school, many=False)
    students = Student.studentsTable.filter(route_id=reqBody["route"]["id"])
    students_serializer = StudentSerializer(students, many=True)
    data["name"] = route_serializer.data["name"]
    data["school"] = school_serializer.data["name"]
    data["description"] = route_serializer.data["description"]
    student_list = []
    for student in students_serializer.data:
        id = student["id"]
        first_name = student["first_name"]
        last_name = student["last_name"]
        student_list.append({'id': id, 'first_name': first_name, 'last_name' : last_name})
    if len(student_list) != 0:
        data["students"] = student_list
    return Response(data)

@api_view(["POST"])
@permission_classes([AllowAny]) # TODO: change to IsAuthenticated once connected
def route_edit(request):
    data = {}
    reqBody = json.loads(request.body)
    route_object =  Route.routeTables.get(name = reqBody['previous_route_name'])
    new_name = reqBody['new_name']
    new_school = School.schoolsTable.get(name = reqBody['new_school'])
    new_description = reqBody['new_description']
    route_object.name = new_name
    route_object.school_id = new_school
    route_object.description = new_description
    route_object.save()
    data["message"] = "route edited successfully"
    result = {"data" : data}
    return Response(result)

@api_view(["POST"])
@permission_classes([AllowAny]) # TODO: change to IsAuthenticated once connected
def route_delete(request):
    data = {}
    reqBody = json.loads(request.body)
    route_object =  Route.routeTables.get(name = reqBody['route_name'])
    route_object.delete()
    data["message"] = "route successfully deleted"
    result = {"data" : data}
    return Response(result)

def users(request):
    return render(request, 'users.html', {})

@api_view(["GET"])
@permission_classes([AllowAny]) # Needs to be changed to IsAuthenticated
def users_detail(request):
    data = {}
    reqBody = json.loads(request.body)
    try:
        user = User.objects.get(pk=reqBody["user"]["id"])
        user_serializer = UserSerializer(user, many=False)
        data["first_name"] = user_serializer.data["first_name"]
        data["last_name"] = user_serializer.data["last_name"]
        data["email"] = user_serializer.data["email"]
        if user_serializer.data["is_parent"]:
            data["address"] = user_serializer.data["address"]
            students = Student.studentsTable.filter(user_id=reqBody["user"]["id"])
            students_serializer = StudentSerializer(students, many=True)
            student_list = []
            for student in students_serializer.data:
                id = student["id"]
                first_name = student["first_name"]
                last_name = student["last_name"]
                route_serializer = Route.routeTables.get(pk=student["route_id"])
                route_name = route_serializer.data["name"]
                student_list.append({'id': id, 'first_name': first_name, 'last_name' : last_name, 'route_name' : route_name})
            data["students"] = student_list
        data["is_staff"] = user_serializer.data["is_staff"]
        return Response(data)
    except BaseException as e:
        raise ValidationError({"messsage": "User does not exist"})

def users_create(request):
    return render(request, 'users_create.html', {})

def users_edit(request):
    return render(request, 'users_edit.html', {})

def routeplanner(request):
    return render(request, 'route_planner.html', {})

