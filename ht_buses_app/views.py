from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.authtoken.models import Token
from .models import School, Route, Student, User
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

@api_view(["POST"])
@permission_classes([AllowAny]) 
def signup(request):
    try:
        data = []
        serializer = RegistrationSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = Token.objects.create(user=user)[0].key
            data["message"] = "User registered successfully"
            data["email"] = user.email
            data["token"] = token
        else:
            data= serializer.errors
        return Response(data)
    except IntegrityError as e:
        user = User.objects.get(email = email)
        user.delete()
        raise ValidationError({"400": f'{str(e)}'})
    except KeyError as e:
        raise ValidationError({"400": f'Field {str(e)} missing'})


def schools(request):
    return render(request, 'schools.html', {})

def routes(request):
    return render(request, 'routes.html', {})

def users(request):
    return render(request, 'users.html', {})

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