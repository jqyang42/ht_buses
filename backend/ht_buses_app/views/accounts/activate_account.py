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


def send_account_activation_email(user):  
    data = {}
    url = account_tools.account_activation_url(user)
    from_email = constants.FROM_DISPLAY
    msg_plain = render_to_string(constants.ACCOUNT_ACTIVATE_TEXT, ({'first_name': user.first_name, 'last_name': user.last_name, 'url': url}))
    msg_html = render_to_string(constants.ACCOUNT_ACTIVATE_TEMPLATE, ({'first_name': user.first_name, 'last_name': user.last_name, 'url': url}))
    subject = constants.ACCOUNT_ACTIVATION_SUBJECT
    try:
        if "@example.com" not in user.email: 
            send_mail(subject, msg_plain, from_email, [user.email], html_message=msg_html, fail_silently=False)
        data["message"] = "message successfully sent"
        data["success"] = True
    except:
        data["message"] = "message not successfully sent"
        data["success"] = False
    return data
