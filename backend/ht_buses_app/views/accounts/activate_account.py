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


def send_account_activation_email(user):  
    data = {}
    url = account_tools.account_activation_url(user)
    from_email = constants.FROM_DISPLAY
    text_content = """
    Hi {} {},

    An account has been created on your behalf. Please follow the link below to finish setting up your account.

    {}
    """.format(user.first_name,user.last_name,url)
    subject = constants.ACCOUNT_ACTIVATION_SUBJECT
    try:
        send_mail(subject, text_content, from_email, [user.email],fail_silently=False)
        data["message"] = "message successfully sent"
        data["success"] = True
        return data
    except:
        data["message"] = "message not successfully sent"
        data["success"] = False
        return data

