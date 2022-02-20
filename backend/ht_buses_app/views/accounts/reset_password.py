from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
from . import account_tools
from ..general import general_apis
from ...constants import constants
from django.core.mail import send_mail
from django.template.loader import render_to_string


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny]) 
def send_reset_password_email(request): #to actually send email with reset link 
    data = {}
    reqBody  = request.data
    email = reqBody['email']
    try: 
        user = User.objects.get(email = email)
    except: 
        data["message"] = 'email does not belong to a user'
        data["success"] = False
        return Response(data)
    url = account_tools.password_reset_url(user)
    from_email = constants.FROM_DISPLAY
    msg_plain = "" #render_to_string('templates/email.txt', {'some_params': some_params})
    msg_html = render_to_string(constants.PASSWORD_RESET_TEMPLATE, ({'first_name': user.first_name, 'last_name': user.last_name, 'url': url}))
    subject = constants.PASSWORD_RESET_SUBJECT
    try:
        send_mail(subject, msg_plain, from_email, [user.email], html_message=msg_html, fail_silently=False)
        data["message"] = "message successfully sent"
        data["success"] = True
    except:
        data["message"] = "message not successfully sent"
        data["success"] = False
    return Response(data)

@csrf_exempt
@api_view(['PATCH'])
@permission_classes([AllowAny]) 
def reset_password(request): #to update password
    data = {}
    reqBody  = request.data
    uuid = request.query_params["uuid"]
    password_reset_token = request.query_params["token"]
    data = password_reset_message(uuid, password_reset_token)
    if not data["success"]:
        return Response(data)
    try:
        user = User.objects.get(pk = account_tools.decode_user(uuid))
        user.set_password(reqBody['user']['password'])
        user.save()
        data["message"] = 'password was successfully saved'
        data["success"] = True
    except:
        data["message"] = 'password for this user could not be saved'
        data["success"] = False
    return Response(data)
    
    
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny]) 
def valid_password_reset_url(request):
    data = {}
    uuid = request.query_params["uuid"]
    password_reset_token = request.query_params["token"]
    data = password_reset_message(uuid, password_reset_token)
    return Response(data)

        
def password_reset_message(uuid, password_reset_token):
    data={}
    if account_tools.password_reset_params_valid(uuid, password_reset_token):
        data["message"] = 'url is valid'
        data["success"] = True
    else:
        data["message"] = 'url is not valid'
        data["success"] = False
    return data





