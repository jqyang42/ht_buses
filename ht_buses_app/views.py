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

# Login API
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
        print("here")
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
    student = Student.objects.get(pk=reqBody["student"]["id"])
    student_serializer = StudentSerializer(student, many=False)
    route = Route.objects.get(pk=student_serializer.data["route_id"])
    route_serializer = RouteSerializer(route, many=False)
    school = School.objects.get(pk=student_serializer.data["school_id"])
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

@api_view(["GET"])
# Needs to be changed to IsAuthenticated
@permission_classes([AllowAny])
def schools_detail(request):
    data = {}
    reqBody = json.loads(request.body)
    school = School.objects.get(pk=reqBody["school"]["id"])
    school_serializer = SchoolSerializer(school, many=False)
    students = Student.objects.filter(school_id__icontains=reqBody["school"]["id"])
    students_serializer = StudentSerializer(students, many=True)
    route = Route.objects.filter(school_id__icontains=reqBody["school"]["id"])
    route_serializer = RouteSerializer(route, many=True)
    data["name"] = school_serializer["data"]["name"]
    data["address"] = school_serializer["data"]["address"]
    student_list = []
    for student in students_serializer["data"]:
        id = student["id"]
        first_name = student["first_name"]
        last_name = student["last_name"]
        # need to do lookup on bus route
        route_id = student["route_id"]
        student_route = Route.objects.get(pk=route_id)
        student_route_serializer = RouteSerializer(student_route, many=False)
        route_name = student_route_serializer["data"]["name"]
        student_list.append({'id': id, 'first_name': first_name, 'last_name' : last_name, 'route_name': route_name})
    data["students"] = student_list
    route_list = []
    for school_route in route_serializer["data"]:
        id = school_route["name"]
        name = school_route["name"]
        # need to find student count per route
        route_count = Student.objects.filter(route_id__icontains=school_route["route_id"])
        student_count = len(route_count["data"])
        route_list.append({'id': id, 'name': name, 'student_count': student_count})
    data["routes"] = route_list
    return Response(data)

def schools_create(request):
    return render(request, 'schools_create.html', {})

def schools_edit(request):
    return render(request, 'schools_edit.html', {})

def routes(request):
    return render(request, 'routes.html', {})

@api_view(["GET"])
# Needs to be changed to IsAuthenticated
@permission_classes([AllowAny])
def routes_detail(request):
    data = {}
    reqBody = json.loads(request.body)
    route = Route.objects.get(pk=reqBody["route"]["id"])
    route_serializer = RouteSerializer(route, many=False)
    school = School.objects.get(pk=route_serializer.data["school_id"])
    school_serializer = SchoolSerializer(school, many=False)
    students = Student.objects.filter(route_id__icontains=reqBody["route"]["id"])
    students_serializer = StudentSerializer(students, many=True)
    data["name"] = route_serializer["data"]["name"]
    data["school"] = school_serializer["data"]["school"]
    data["description"] = route_serializer["data"]["description"]
    student_list = []
    for student in students_serializer["data"]:
        id = student["id"]
        first_name = student["first_name"]
        last_name = student["last_name"]
        student_list.append({'id': id, 'first_name': first_name, 'last_name' : last_name})
    data["students"] = student_list
    return Response(data)

def routes_edit(request):
    return render(request, 'routes_edit.html', {})

def users(request):
    return render(request, 'users.html', {})

@api_view(["GET"])
# Needs to be changed to IsAuthenticated
@permission_classes([AllowAny])
def users_detail(request):
    data = {}
    reqBody = json.loads(request.body)
    user = User.objects.get(pk=reqBody["id"])
    user_serializer = UserSerializer(user, many=False)
    data["first_name"] = user_serializer["data"]["first_name"]
    data["last_name"] = user_serializer["data"]["last_name"]
    data["email"] = user_serializer["data"]["email"]
    if user_serializer["data"]["is_parent"]:
        data["address"] = user_serializer["data"]["parent"]
        students = Student.objects.filter(user_id__icontains=reqBody["id"])
        students_serializer = StudentSerializer(students, many=True)
        student_list = []
        for student in students_serializer["data"]:
            id = student["id"]
            first_name = student["first_name"]
            last_name = student["last_name"]
            route_serializer = Route.objects.get(pk=student["route_id"])
            route_name = route_serializer["data"]["name"]
            student_list.append({'id': id, 'first_name': first_name, 'last_name' : last_name, 'route_name' : route_name})
        data["students"] = student_list
    data["is_staff"] = user_serializer["data"]["is_staff"]
    return Response(data)

def users_create(request):
    return render(request, 'users_create.html', {})

def users_edit(request):
    return render(request, 'users_edit.html', {})

def routeplanner(request):
    return render(request, 'route_planner.html', {})