from django.shortcuts import render
from rest_framework.authtoken.models import Token
from .models import School, Route, Student, User, UserManager
from django.contrib.auth import authenticate
from django.contrib.auth import login, logout
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.parsers import json
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from .serializers import StudentSerializer, RouteSerializer, SchoolSerializer, UserSerializer

# TESTER METHOD FOR FRONTEND PAGINATION
@api_view(['GET'])
@permission_classes([AllowAny]) # TODO: This needs to be changed to IsAuthenticate[d
def schools_all(request):
    schools = School.schoolsTable.all()
    school_serializer = SchoolSerializer(schools, many=True)
    return Response(school_serializer.data)

@api_view(["POST"])
@permission_classes([AllowAny]) 
def user_login(request):
    info = {}
    reqBody = json.loads(request.body)
    email = reqBody['email']
    password = reqBody['password']
    try:
        user = User.objects.get(email=email)
    except BaseException as e:
        return Response({"message": "An account with this email does not exist.",  "token":'', "valid_login": False})
    if not check_password(password, user.password):
        return Response({"message": "Password was incorrect.",  "token":'', "valid_login": False})
    #try:
    login(request._request, user,backend = 'ht_buses_app.authenticate.AuthenticationBackend')
    token = Token.objects.get_or_create(user=user)[0].key
    info["id"] = user.id
    info["is_staff"] = user.is_staff
    info["email"] = user.email
    info["first_name"] = user.first_name
    info["last_name"] = user.last_name
    message = "User was logged in successfully"
    return Response({"info": info,"mesage":message, "token":token, "valid_login": True})
    #except: 
        #return Response({"message": "This account could not be logged in, please contact administrators for help.",  "token":'', "valid_login": False})

# Logout API
@api_view(["POST"])
@permission_classes([AllowAny])
def user_logout(request):
    try:
        reqBody = json.loads(request.body)
        user_id = User.objects.get(pk = reqBody["user_id"])
        user_id.auth_token.delete()
        logout(request._request)
        return Response({"message":'User was logged out successfully'})  
    except:
        return Response({"message":'Unsuccessful logout'}) 


@api_view(["POST"]) 
def validAccess(request):
    info = {}
    try:
        reqBody = json.loads(request.body)
        session_token = reqBody['token']
        id = reqBody['user_id']
        user_token = User.objects.get(pk = id).auth_token
        valid_token = user_token == session_token
        message = "The session token is valid"
        is_staff = User.objects.get(pk = id).is_staff 
        return Response({"mesage":message, "valid_token": True,"is_staff":is_staff})
    except:
        message = "Invalid token, user is not logged in"
        return Response({"mesage":message, "valid_token": False, "is_staff":False}, status = 401)

# User Creation API
@api_view(["POST"])
@permission_classes([IsAdminUser])
def user_create(request):
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
        user = User.objects.create_superuser(email=email, first_name=first_name, last_name=last_name, is_parent= is_parent, password=password, address=address)
    else:
        user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, is_parent= is_parent, address= address, password=password)
    if is_parent:
        create_students(request, user)
    data["message"] = "User created successfully"
    result = {"data" : data}
    return Response(result)

# Student Create
@permission_classes([IsAdminUser])
def create_students(request, user):
    data = {}
    reqBody = json.loads(request.body)
    user_id = user
    for student in reqBody['students']:
        first_name = student['first_name']
        last_name = student['last_name']
        school_id = School.schoolsTable.get(name=student["school_name"])
        student_school_id = student['student_school_id']
        if (student['route_name'] != None):
            route_id = Route.routeTables.get(name=student['route_name'])
            Student.studentsTable.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user_id, student_school_id=student_school_id, route_id = route_id)
        else:
            Student.studentsTable.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user_id, student_school_id=student_school_id, route_id = None)
    data["message"] = "students registered successfully"
    result = {"data" : data}
    return Response(result)
    

# Students Detail API
@api_view(["GET"])
@permission_classes([IsAdminUser]) 
def students_detail(request):
    data = {}
    id = request.query_params["id"]
    student = Student.studentsTable.get(pk=id)
    student_serializer = StudentSerializer(student, many=False)
    if student_serializer.data["route_id"] == None:
        route_id = 0
        route_name = "Unassigned"
    else:
        route = Route.routeTables.get(pk=student_serializer.data["route_id"])
        route_serializer = RouteSerializer(route, many=False)
        route_id = route_serializer.data["id"]
        route_name = route_serializer.data["name"]

    school = School.schoolsTable.get(pk=student_serializer.data["school_id"])
    school_serializer = SchoolSerializer(school, many=False)
    data["user_id"] = student_serializer.data["user_id"]
    data["student_school_id"] = student_serializer.data["student_school_id"]
    data["first_name"] = student_serializer.data["first_name"]
    data["last_name"] = student_serializer.data["last_name"]
    school_arr = []
    school_arr.append({'id' : student_serializer.data["school_id"], 'name' : school_serializer.data["name"]})
    data["school"] = school_arr[0]
    route_arr = []
    route_arr.append({'id' : route_id, 'name' : route_name})
    data["route"] = route_arr[0]
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAdminUser]) 
def students(request):
    data = {}
    # COMMENTED OUT CODE FOR PAGINATION
    #page_number = request.query_params["page"]
    # For now I will retrieve 10 records for each page request, can be changed
    # if int(page_number) == 1:
    #     students = Student.studentsTable.all()[:10*int(page_number)]
    # else:
    #     students = Student.studentsTable.all()[1+10*(int(page_number)-1):10*int(page_number)]
    students = Student.studentsTable.all()
    student_serializer = StudentSerializer(students, many=True)
    student_list = []
    for student in student_serializer.data:
        id = student["id"]
        student_school_id = student["student_school_id"]
        first_name = student["first_name"]
        last_name = student["last_name"]
        parent = User.objects.get(pk=student["user_id"])
        parent_serializer = UserSerializer(parent, many=False)
        parent_first = parent_serializer.data["first_name"]
        parent_last = parent_serializer.data["last_name"]
        parent_name = {'first_name' : parent_first, 'last_name' : parent_last}
        school = School.schoolsTable.get(pk=student["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        school_name = school_serializer.data["name"]
        if student["route_id"] == None:
            route = 0
            route_name = "Unassigned"
        else:
            route = Route.routeTables.get(pk=student["route_id"])
            route_serializer = RouteSerializer(route, many=False)
            route_name = route_serializer.data["name"]
        student_list.append({'id' : id, 'student_school_id' : student_school_id, 'first_name' : first_name, 'last_name' : last_name, 'school_name' : school_name, 'route_name' : route_name, 'parent' : parent_name})
    data["students"] = student_list
    return Response(data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def student_edit(request):
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
@permission_classes([IsAdminUser])
def student_delete(request):
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
@permission_classes([IsAdminUser]) 
def schools(request):
    data = {}
    schools = School.schoolsTable.all()
    # COMMENTED OUT CODE FOR PAGINATION
    # page_number = request.query_params["page"]
    # if int(page_number) == 1:
    #     schools = School.schoolsTable.all()[:10*int(page_number)]
    # else:
    #     schools = School.schoolsTable.all()[(1+10*(int(page_number)-1)):(10*int(page_number))]
    school_serializer = SchoolSerializer(schools, many=True)
    data["schools"] = school_serializer.data
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAdminUser]) 
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
            student_id = student["id"]
            student_school_id = student["student_school_id"]
            first_name = student["first_name"]
            last_name = student["last_name"]
            if student["route_id"] == None:
                route_id = 0
                route_name = "Unassigned"
            else:
                route_id = student["route_id"]
                student_route = Route.routeTables.get(pk=route_id)
                student_route_serializer = RouteSerializer(student_route, many=False)
                route_name = student_route_serializer.data["name"]
            student_list.append({'id' : student_id, 'student_school_id': student_school_id, 'first_name': first_name, 'last_name' : last_name, 'route_name': route_name})
        if len(student_list) != 0:
            data["students"] = student_list
        route_list = []
        for school_route in route_serializer.data:
            route_id = school_route["id"]
            name = school_route["name"]
            route_count = Student.studentsTable.filter(route_id=Route.routeTables.get(pk=route_id))
            route_count_serialize = StudentSerializer(route_count, many=True)
            student_count = len(route_count_serialize.data)
            route_list.append({'id' : route_id, 'name': name, 'student_count': student_count})
        if len(route_list) != 0:
            data["routes"] = route_list
        return Response(data)
    except BaseException as e:
        raise ValidationError({"messsage": "School does not exist"})

@api_view(["POST"])
@permission_classes([IsAdminUser]) 
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
@permission_classes([IsAdminUser])
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
@permission_classes([IsAdminUser])
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
@permission_classes([IsAdminUser])
def route_create(request):
    data = {}
    reqBody = json.loads(request.body)
    name = reqBody['route_name']
    try:
        school = School.schoolsTable.filter(name = reqBody['school_name'])[0]
        description = reqBody['route_description']
        route = Route.routeTables.create(name=name, school_id = school, description = description)
        route_serializer = RouteSerializer(route, many=False)
        data["message"] = "route created successfully"
        data["route"] = route_serializer.data
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"message": "route could not be created"})

@api_view(["GET"])
@permission_classes([IsAdminUser])
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
    data["school"] = {'id' : route_serializer.data["school_id"], 'name' : school_serializer.data["name"]}
    data["description"] = route_serializer.data["description"]
    student_list = []
    for student in students_serializer.data:
        student_id = student["id"]
        student_school_id = student["student_school_id"]
        first_name = student["first_name"]
        last_name = student["last_name"]
        student_list.append({'id' : student_id, 'student_school_id': student_school_id, 'first_name': first_name, 'last_name' : last_name})
    if len(student_list) != 0:
        data["students"] = student_list
    return Response(data)

@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def route_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        route_object =  Route.routeTables.get(pk=id)
        route_object.name = reqBody['route_name']
        # route_object.school_id =  School.schoolsTable.filter(name = reqBody['school_name'])[0]
        route_object.description = reqBody['route_description']
        route_object.save()
        data["message"] = "route updated successfully"
        result = {"data" : data}
        return Response(result)
    except BaseException as e:
        raise ValidationError({"messsage": "invalid options were chosen"})

@api_view(["POST"])
@permission_classes([IsAdminUser]) 
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

@api_view(["GET"])
@permission_classes([IsAdminUser])
def routes(request):
    data = {}
    routes_filter = []
    routes = Route.routeTables.all()
    # COMMENTED OUT CODE FOR PAGINATION
    # page_number = request.query_params["page"]
    # # For now I will retrieve 10 records for each page request, can be changed
    # if int(page_number) == 1:
    #     routes = Route.routeTables.all()[:10*int(page_number)]
    # else:
    #     routes = Route.routeTables.all()[1+10*(int(page_number)-1):10*int(page_number)]
    route_serializer = RouteSerializer(routes, many=True)
    # sort routes
    for route in route_serializer.data:
        id = route["id"]
        name = route["name"]
        school = School.schoolsTable.get(pk=route["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        school_name = school_serializer.data["name"]
        route_students = Student.studentsTable.filter(route_id=id)
        student_serializer = StudentSerializer(route_students, many=True)
        student_count = len(student_serializer.data)
        routes_filter.append({'id' : id, 'name' : name, 'school_name': school_name, 'student_count': student_count})
    data["routes"] = routes_filter
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAdminUser]) 
def users(request):
    data = {}
    users = User.objects.all()
    # COMMENTED OUT CODE FOR PAGINATION
    # page_number = request.query_params["page"]
    # # For now I will retrieve 10 records for each page request, can be changed
    # if int(page_number) == 1:
    #     users = User.objects.all()[:10*int(page_number)]
    # else:
    #     users = User.objects.all()[1+10*(int(page_number)-1):10*int(page_number)]
    user_serializers = UserSerializer(users, many=True)
    users_arr = []
    for user in user_serializers.data:
        id = user["id"]
        first_name = user["first_name"]
        last_name = user["last_name"]
        email = user["email"]
        is_staff = user["is_staff"]
        is_parent = user["is_parent"]
        address = user["address"]
        users_arr.append({'id' : id, 'first_name' : first_name, 'last_name' : last_name, 'email' : email, 'is_staff' : is_staff, 'is_parent' : is_parent, 'address' : address})
    data["users"] = users_arr
    return Response(data)

@api_view(["GET"])
@permission_classes([IsAdminUser])
def users_detail(request):
    data = {}
    id = request.query_params["id"]
    try:
        user = User.objects.get(pk=id)
        user_serializer = UserSerializer(user, many=False)
        data["first_name"] = user_serializer.data["first_name"]
        data["last_name"] = user_serializer.data["last_name"]
        data["email"] = user_serializer.data["email"]
        if user_serializer.data["is_parent"] == True:
            data["address"] = user_serializer.data["address"]
            students = Student.studentsTable.filter(user_id=user_serializer.data["id"])
            students_serializer = StudentSerializer(students, many=True)
            student_list = []
            for student in students_serializer.data:
                student_id = student["id"]
                student_school_id = student["student_school_id"]
                student_first_name = student["first_name"]
                student_last_name = student["last_name"]
                if student["route_id"] == None:
                    route_name = "Unassigned"
                else:
                    route_student = Route.routeTables.get(pk=student["route_id"])
                    route_serializer = RouteSerializer(route_student, many=False)
                    route_name = route_serializer.data["name"]
                student_list.append({'id' : student_id, 'student_school_id': student_school_id, 'first_name': student_first_name, 'last_name' : student_last_name, 'route_name' : route_name})
            data["students"] = student_list
        data["is_staff"] = user_serializer.data["is_staff"]
        data["is_parent"] = user_serializer.data["is_parent"]
        return Response(data)
    except BaseException as e:
        raise ValidationError({"message": "User does not exist"})

@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def user_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    user_object = User.objects.get(pk = id)
    user_object.email = reqBody['email']
    #user_object.password = reqBody['password']
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

# def edit_or_create_student(student_info,id=None):
#     data = {}
#     first_name = student_info['first_name']
#     last_name = student_info['last_name']
#     student_school_id = student_info['student_school_id']
#     try:
#         user_id = User.objects.get(pk = id)
#         route_id = Route.routeTables.filter(name = student_info['route_name'])[0]
#         school_id = School.schoolsTable.filter(name =student_info['school_name'])[0]

#     except BaseException as e:
#         raise ValidationError({"messsage": "Invalid options were chosen"})
#     try: 
#         student_object = Student.studentsTable.filter(student_school_id = student_school_id, user_id = user_id)[0] # Need to have something that doesn't change
#         student_object.first_name = first_name
#         student_object.last_name = last_name
#         student_object.school_id = school_id
#         student_object.student_school_id = student_school_id
#         student_object.route_id = route_id
#         student_object.save()
#         data["message"] = "student updated successfully"
#         result = {"data" : data}
#         return Response(result) 
#     except: 
#         Student.studentsTable.create(first_name=first_name, last_name=last_name, school_id=school_id, user_id=user_id, student_school_id=student_school_id, route_id=route_id)
#         data["message"] = "student created successfully"
#         result = {"data" : data}
#         return Response(result) 
    
@api_view(["POST"])
@permission_classes([IsAdminUser]) 
def user_delete(request):
    data = {}
    reqBody = json.loads(request.body)
    try:
        user_object =  User.objects.filter(first_name = reqBody['first_name'], last_name =reqBody['last_name'], email = reqBody['email'])
        user_object.delete()
        data["message"] = "user successfully deleted"
        result = {"data" : data}
        return Response(result)
    except:
        data["message"] = "User could not be deleted"
        result = {"data" : data}
        return Response(result) 

@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def user_password_edit(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    try:
        user_object = User.objects.get(pk = id)
        user_object.set_password(reqBody['password'])
        user_object.save()
        data["message"] = "User password updated successfully"
        result = {"data" : data}
        return Response(result) 
    except:
        data["message"] = "User's password could not be updated"
        result = {"data" : data}
        return Response(result)    

@api_view(["GET"])
@permission_classes([IsAdminUser])
def routeplanner(request):
    data = {}
    id = request.query_params["id"] # This is the school id
    school = School.schoolsTable.get(pk=id)
    school_serializer = SchoolSerializer(school, many=False)
    data["name"] = school_serializer.data["name"]
    data["address"] = school_serializer.data["address"]
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
                    parent_student_arr.append({'id' : child["id"], 'route_id' : 0})
                else:
                    parent_student_arr.append({'id' : child["id"], 'route_id' : child["route_id"]})
            address_arr.append({'id' : student["user_id"], 'address' : parent_serializer.data["address"], 'students': parent_student_arr})
    data["parents"] = address_arr
    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated]) 
def parent_dashboard(request):
    data = {}
    id = request.query_params["id"] # need id of parent
    user = User.objects.get(pk=id)
    user_serializer = UserSerializer(user, many=False)
    data["first_name"] = user_serializer.data["first_name"]
    data["last_name"] = user_serializer.data["last_name"]
    students = Student.studentsTable.filter(user_id=id)
    student_serializer = StudentSerializer(students, many=True)
    parent_kids = []
    for student in student_serializer.data:
        id = student["id"]
        first_name = student["first_name"]
        last_name = student["last_name"]
        school = School.schoolsTable.get(pk=student["school_id"])
        school_serializer = SchoolSerializer(school, many=False)
        school_name = school_serializer.data["name"]
        if student["route_id"] == None:
            route_name = "Unassigned"
        else:
            route = Route.routeTables.get(pk=student["route_id"])
            route_serializer = RouteSerializer(route, many=False)
            route_name = route_serializer.data["name"]
        parent_kids.append({'id' : id, 'first_name' : first_name, 'last_name' : last_name, 'school_name' : school_name, 'route_name' : route_name})
        data["students"] = parent_kids
    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated]) 
def parent_student_detail(request):
    data = {}
    id = request.query_params["id"]
    student = Student.studentsTable.get(pk=id)
    student_serializer = StudentSerializer(student, many=False)
    data["school_student_id"] = student_serializer.data["student_school_id"]
    data["first_name"] = student_serializer.data["first_name"]
    data["last_name"] = student_serializer.data["last_name"]
    school = School.schoolsTable.get(pk=student_serializer.data["school_id"])
    school_serializer = SchoolSerializer(school, many=False)
    data["school_name"] = school_serializer.data["name"]
    if ["route_id"] == None:
        route_name = "Unassigned"
        route_description = ""
    else:
        route = Route.routeTables.get(pk=student_serializer.data["route_id"])
        route_serializer = RouteSerializer(route, many=False)
        route_name = route_serializer.data["name"]
        route_description = route_serializer.data["description"]
    data["route"] = {'name' : route_name, 'description' : route_description}
    return Response(data)

