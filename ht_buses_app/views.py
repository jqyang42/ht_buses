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


def students_detail(request):
    return render(request, 'students_detail.html', {})

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

def schools_detail(request):
    return render(request, 'schools_detail.html', {})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def schools_create(request):
    data = {}
    reqBody = json.loads(request.body)
    name = reqBody['school_name']
    address = reqBody['school_address']
    School.schoolsTable.create(name=name, address = address)
    data["message"] = "school created successfully"
    result = {"data" : data}
    return Response(result)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def schools_edit(request):
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
    return Response(request)

def routes_create(request):
    data = {}
    reqBody = json.loads(request.body)
    name = reqBody['route_name']
    school = School.schoolsTable.get(name = reqBody['school'])
    description = reqBody['route_description']
    Route.routeTables.create(name=name, school_id = school, description = description)
    data["message"] = "route created successfully"
    result = {"data" : data}
    return Response(request)

def routes_detail(request):
    return render(request, 'routes_detail.html', {})

def routes_edit(request):
    data = {}
    reqBody = json.loads(request.body)
    route_object =  Route.routeTables.get(name = reqBody['previous_route_name'])
    new_name = reqBody['new_name']
    new_address = reqBody['new_address']
    route_object.name = new_name
    route_object.address = new_address
    route_object.save()
    data["message"] = "route edited successfully"
    result = {"data" : data}
    return Response(request)

def users(request):
    return render(request, 'users.html', {})

def users_detail(request):
    return render(request, 'users_detail.html', {})

def users_create(request):
    return render(request, 'users_create.html', {})

def users_edit(request):
    return render(request, 'users_edit.html', {})

def routeplanner(request):
    return render(request, 'route_planner.html', {})
    
'''
# NOTE: To create a sample school, route, user, and parent for viewing , add to students, method uncomment below and :
    user = createTempUser()
    logged_in =  True
'''
'''
def createTempUser():
    school = School(name = "East", address = "56 Yellow Road")
    school.save()
    route = Route(name="Route 5", school_id = school,description="This is route 5" )
    route.save()
    parent = User(first_name = "John", last_name= "Garcia" , email='g@duke.edu',password='admin',address = "90 East Ave",is_parent=False, is_staff = True)
    parent = User.objects.get(email = parent.email)
    parent.save()
    student = Student(first_name = "Peter", last_name = "Piper", school_id = school, student_school_id = 232, route_id = route, user_id = parent)
    student.save()
    return parent
'''
