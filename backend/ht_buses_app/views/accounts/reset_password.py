from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import json
from rest_framework.response import Response
from . account_tools import encode_user, decode_user, password_reset_params_valid, password_reset_token_generator
from ..general import general_apis
from ...constants import constants
from django.core.mail import send_mail

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny]) 
def send_reset_password_email(request): #to actually send email to reset 
    data = {}
    reqBody  = request.data
    email = reqBody['email']
    try: 
        user = User.objects.get(email = email)
    except: 
        data["message"] = 'email does not belong to a user'
        data["success"] = False
    uuid = encode_user(user)
    password_reset_token = password_reset_token_generator.make_token(user)
    url = constants.PASSWORD_RESET_URL_FRONTEND + str(uuid) + '&' + str(password_reset_token)
    from_email = constants.FROM_DISPLAY
    text_content = """
    Hi {} {},

    An account with this email has been created for you.
    Please follow this link to finish setting up your account.

    {}
    """.format(user.first_name,user.last_name,url)
    subject = "Activate Your Account"
    send_mail(subject, text_content, from_email, [user.email],fail_silently=False)
    #reply_to=[constants.DEFAULT_NO_REPLY_EMAIL]
    try:
        data["message"] = "message successfully sent"
        data["success"] = True
        return Response(data)
    except:
        data["message"] = "message not successfully sent"
        data["success"] = False
        return Response(data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny]) 
def reset_password(request): #to save the password used 
    data = {}
    reqBody  = request.data
    valid_url_response = valid_password_reset_url(request) 
    print(valid_url_response.data.success)
    if not valid_url_response.data.success:
        return valid_url_response
    uuid = request.query_params["uuid"]
    password_reset_token = request.query_params["token"]
    user = User.objects.get(pk = decode_user(uuid))
    user.set_password(reqBody['password'])
    user.save()
    data["message"] = 'password was successfully saved'
    data["success"] = True
    """
    except:
        data["message"] = 'password was not saved'
        data["success"] = False
    """
    return Response(data)
    
    
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny]) 
def valid_password_reset_url(request):
    data = {}
    uuid = request.query_params["uuid"]
    password_reset_token = request.query_params["token"]
    if password_reset_params_valid(uuid, password_reset_token):
        data["message"] = 'url is valid'
        data["success"] = True
    else:
        data["message"] = 'url is not valid'
        data["success"] = False
    return Response(data)
         




