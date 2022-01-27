from django.shortcuts import render
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
        create_students(request, user)
    data["message"] = "User created successfully"
    result = {"data" : data}
    return Response(result)

# Student Create
def create_students(request, user):
    data = {}
    reqBody = json.loads(request.body)
    user_id = user
    for student in reqBody['students']:
        first_name = student['first_name']
        last_name = student['last_name']
        school_id = School.schoolsTable.get(name=student["school_name"])
        student_school_id = student['student_school_id']
        route_id = Route.routeTables.get(name=student['route_name'])
        student_object = Student.studentsTable.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user_id, student_school_id=student_school_id, route_id=route_id)
    data["message"] = "students registered successfully"
    result = {"data" : data}
    return Response(result)
    

# Students Detail API
@api_view(["GET"])
# Needs to be changed to IsAuthenticated
@permission_classes([AllowAny])
def students_detail(request):
    data = {}
    id = request.query_params["id"]
    # Cannot be tested, need API for creating a parent
    Student.studentsTable.create(first_name="Mary", last_name="Jane", school_id=School.schoolsTable.get(pk=1), student_school_id=3,route_id=Route.routeTables.get(pk=1),user_id=User.objects.get(pk=1))
    student = Student.studentsTable.get(pk=id)
    student_serializer = StudentSerializer(student, many=False)
    route = Route.routeTables.get(pk=student_serializer.data["route_id"])
    route_serializer = RouteSerializer(route, many=False)
    school = School.schoolsTable.get(pk=student_serializer.data["school_id"])
    school_serializer = SchoolSerializer(school, many=False)
    data["student_school_id"] = student_serializer.data["student_school_id"]
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

@api_view(['GET'])
@permission_classes([AllowAny]) # This needs to be changed to IsAuthenticated
def students(request):
    data = {}
    students = Student.studentsTable.all()
    student_serializer = StudentSerializer(students, many=True)
    return Response(student_serializer.data)

@api_view(['PUT'])
@permission_classes([AllowAny]) # This needs to be changed to IsAuthenticated 
def single_student_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    new_first_name = reqBody['first_name']
    new_last_name = reqBody['last_name']
    student_school_id = reqBody['student_school_id']
    try:
        school_id = School.schoolsTable.filter(name=reqBody["school_name"])[0]
        route_id = Route.routeTables.filter(name = reqBody["route_name"])[0]
        parent = reqBody['parent']
        user_id = User.objects.filter(first_name = parent["first_name"], last_name = parent["last_name"], email = parent["email"])[0]
        og_student_object = Student.studentsTable.get(pk = id)   
        og_student_object.last_name = new_last_name
        og_student_object.first_name = new_first_name
        og_student_object.school_id = school_id
        og_student_object.student_school_id = student_school_id
        og_student_object.route_id  = route_id
        og_student_object.user_id = user_id
        og_student_object.save()
        data["message"] = "Student information successfully updated"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "invalid options were chosen"})

@api_view(['POST'])
@permission_classes([AllowAny]) # This needs to be changed to IsAuthenticated
def single_student_delete(request):
    data = {}
    reqBody = json.loads(request.body)
    try:
        student_object =  Student.studentsTable.filter(student_school_id = reqBody['student_school_id'])[0]
        student_object.delete()
        data["message"] = "student successfully deleted"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "student could not be deleted"})

@api_view(['GET'])
@permission_classes([AllowAny]) # This needs to be changed to IsAuthenticated
def schools(request):
    data = {}
    schools = School.schoolsTable.all()
    school_serializer = SchoolSerializer(schools, many=True)
    return Response(school_serializer.data)

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
        data["name"] = school_serializer.data["name"]
        data["address"] = school_serializer.data["address"]
        student_list = []
        for student in students_serializer.data:
            id = student["student_school_id"]
            first_name = student["first_name"]
            last_name = student["last_name"]
            # need to do lookup on bus route
            route_id = student["route_id"]
            student_route = Route.routeTables.get(pk=route_id)
            student_route_serializer = RouteSerializer(student_route, many=False)
            route_name = student_route_serializer.data["name"]
            student_list.append({'student_school_id': id, 'first_name': first_name, 'last_name' : last_name, 'route_name': route_name})
        if len(student_list) != 0:
            data["students"] = student_list
        route_list = []
        for school_route in route_serializer.data:
            name = school_route["name"]
            # need to find student count per route
            route_count = Student.studentsTable.filter(route_id=Route.routeTables.get(pk=id))
            route_count_serialize = StudentSerializer(route_count, many=True)
            student_count = len(route_count_serialize.data)
            route_list.append({'name': name, 'student_count': student_count})
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

@api_view(["PUT"])
@permission_classes([AllowAny]) # TODO: change to IsAuthenticated once connected
def school_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        school_object =  School.schoolsTable.filter(pk = id)
        school_object.name = reqBody['school_name']
        school_object.address = reqBody['school_address']
        school_object.save()
        data["message"] = "school information updated successfully"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "school cannot be edited bc it does not exist"})

@api_view(["POST"])
@permission_classes([AllowAny]) # TODO: change to IsAuthenticated once connected
def school_delete(request):
    data = {}
    reqBody = json.loads(request.body)
    try:
        school_object =  School.schoolsTable.filter(name = reqBody['school_name'])[0]
        school_object.delete()
        data["message"] = "school successfully deleted"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "school could not be deleted"})

@api_view(["POST"])
@permission_classes([AllowAny]) # TODO: change to IsAuthenticated once connected
def route_create(request):
    data = {}
    reqBody = json.loads(request.body)
    name = reqBody['route_name']
    try:
        school = School.schoolsTable.filter(name = reqBody['school_name'])[0]
        description = reqBody['route_description']
        Route.routeTables.create(name=name, school_id = school, description = description)
        data["message"] = "route created successfully"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "route could not be created"})

@api_view(["GET"])
@permission_classes([AllowAny]) # Needs to be changed to IsAuthenticated
def routes_detail(request):
    data = {}
    id = request.query_params["id"]
    route = Route.routeTables.get(pk=id)
    route_serializer = RouteSerializer(route, many=False)
    school = School.schoolsTable.get(pk=route_serializer.data["school_id"])
    school_serializer = SchoolSerializer(school, many=False)
    students = Student.studentsTable.filter(route_id=id)
    students_serializer = StudentSerializer(students, many=True)
    data["name"] = route_serializer.data["name"]
    data["school"] = school_serializer.data["name"]
    data["description"] = route_serializer.data["description"]
    student_list = []
    for student in students_serializer.data:
        id = student["student_school_id"]
        first_name = student["first_name"]
        last_name = student["last_name"]
        student_list.append({'student_school_id': id, 'first_name': first_name, 'last_name' : last_name})
    if len(student_list) != 0:
        data["students"] = student_list
    return Response(data)

@api_view(["PUT"])
@permission_classes([AllowAny]) # TODO: change to IsAuthenticated once connected
def route_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        route_object =  Route.routeTables.get(pk = id)[0]
        route_object.name = reqBody['route_name']
        route_object.school_id =  School.schoolsTable.filter(name = reqBody['school_name'])[0]
        route_object.description = reqBody['route_description']
        route_object.save()
        data["message"] = "route updated successfully"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "invalid options were chosen"})

@api_view(["POST"])
@permission_classes([AllowAny]) # TODO: change to IsAuthenticated once connected
def route_delete(request):
    data = {}
    reqBody = json.loads(request.body)
    try:
        route_object =  Route.routeTables.filter(name = reqBody['route_name'])[0]
        route_object.delete()
        data["message"] = "route successfully deleted"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "Route could not be deleted"})

@api_view(['GET'])
@permission_classes([AllowAny]) # This needs to be changed to IsAuthenticated
def users(request):
    data = {}
    users = User.objects.all()
    user_serializers = UserSerializer(users, many=True)
    return Response(user_serializers.data)

@api_view(["GET"])
@permission_classes([AllowAny]) # Needs to be changed to IsAuthenticated
def users_detail(request):
    data = {}
    id = request.query_params["id"]
    try:
        user = User.objects.get(pk=id)
        user_serializer = UserSerializer(user, many=False)
        data["first_name"] = user_serializer.data["first_name"]
        data["last_name"] = user_serializer.data["last_name"]
        data["email"] = user_serializer.data["email"]
        if user_serializer.data["is_parent"]:
            data["address"] = user_serializer.data["address"]
            students = Student.studentsTable.filter(user_id=id)
            students_serializer = StudentSerializer(students, many=True)
            student_list = []
            for student in students_serializer.data:
                id = student["student_school_id"]
                first_name = student["first_name"]
                last_name = student["last_name"]
                route_serializer = Route.routeTables.get(pk=student["route_id"])
                route_name = route_serializer.data["name"]
                student_list.append({'student_school_id': id, 'first_name': first_name, 'last_name' : last_name, 'route_name' : route_name})
            data["students"] = student_list
        data["is_staff"] = user_serializer.data["is_staff"]
        return Response(data)
    except BaseException as e:
        raise ValidationError({"messsage": "User does not exist"})

@api_view(["PUT"])
@permission_classes([AllowAny]) # Needs to be changed to IsAuthenticated
def user_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    user_object = User.objects.get(pk = id)
    user_object.email = reqBody['email']
    user_object.password = reqBody['password']
    user_object.first_name = reqBody['first_name']
    user_object.last_name = reqBody['last_name']
    user_object.address = reqBody['address']
    user_object.is_parent = reqBody['is_parent']
    user_object.is_staff = reqBody['is_staff']
    user_object.save()
    if user_object.is_parent is True:
        for student_info in reqBody["students"]:
            edit_or_create_student(student_info, id)
    data["message"] = "User and associated students updated successfully"
    result = {"data" : data}
    return Response(result)

def edit_or_create_student(student_info,id=None):
    data = {}
    first_name = student_info['first_name']
    last_name = student_info['last_name']
    student_school_id = student_info['student_school_id']
    try:
        user_id = User.objects.get(pk = id)
        route_id = Route.routeTables.filter(name = student_info['route_name'])[0]
        school_id = School.schoolsTable.filter(name =student_info['school_name'])[0]

    except BaseException as e:
        raise ValidationError({"messsage": "Invalid options were chosen"})
    try: 
        student_object = Student.studentsTable.filter(student_school_id = student_school_id, user_id = user_id)[0] # Need to have something that doesn't change
        student_object.first_name = first_name
        student_object.last_name = last_name
        student_object.school_id = school_id
        student_object.student_school_id = student_school_id
        student_object.route_id = route_id
        student_object.save()
        data["message"] = "student updated successfully"
        result = {"data" : data}
        return Response(result) 
    except: 
        Student.studentsTable.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user_id, student_school_id=student_school_id, route_id=route_id)
        data["message"] = "student created successfully"
        result = {"data" : data}
        return Response(result) 
    
@api_view(["POST"])
@permission_classes([AllowAny]) # Needs to be changed to IsAuthenticated
def user_delete(request):
    data = {}
    reqBody = json.loads(request.body)
    try:
        user_object =  User.objects.filter(first = reqBody['first_name'], last_name =reqBody['last_name'], email = reqBody['email'])[0]
        user_object.delete()
        data["message"] = "user successfully deleted"
        result = {"data" : data}
        return Response(result)
    except:
        data["message"] = "User could not be deleted"
        result = {"data" : data}
        return Response(result)     

def routeplanner(request):
    return render(request, 'route_planner.html', {})

