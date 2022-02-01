from ...models import School, Route, Student, User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import json
from rest_framework.response import Response

@csrf_exempt
@api_view(["PUT"])
@permission_classes([IsAdminUser]) 
def user_edit(request): # TODO: make try and catch
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    user_object = User.objects.get(pk=id)
    user_object.email = reqBody['email']
    user_object.first_name = reqBody['first_name']
    user_object.last_name = reqBody['last_name']
    user_object.address = reqBody['address']
    user_object.lat = reqBody['lat']
    user_object.long = reqBody['long']
    user_object.is_parent = reqBody['is_parent']
    user_object.is_staff = reqBody['is_staff']
    user_object.save()
    #if user_object.is_parent is True:
    #    for student_info in reqBody["students"]:
    #        create_student(student_info, id)
    data["message"] = "User information was successfully updated"
    result = {"data" : data}
    return Response(result)

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAdminUser]) #TODO : very that the email is valid when sumbit button pressed in user edit form
def valid_edit_email(request):
    data = {}
    id = request.query_params["id"]
    reqBody = json.loads(request.body)
    email = reqBody['email']
    try: 
        user = User.objects.get(email = email)
        if user.id != id:
            data["message"] = "Please enter a different email. A user with this email already exists"
            data["validEmail"] = False
            result = {"data" : data}
            return Response(result)
        else: 
            data["message"] = "The email entered is valid"
            data["validEmail"] = True
            result = {"data" : data}
            return Response(result)
    except: 
        data["message"] = "The email entered is valid"
        data["validEmail"] = True
        result = {"data" : data}
        return Response(result)