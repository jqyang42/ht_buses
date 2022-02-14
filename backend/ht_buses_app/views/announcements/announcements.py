from ...models import User
from ...constants import constants
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import json
from sendgrid.helpers.mail import *
from sendgrid import SendGridAPIClient
from django.conf import settings

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def general_all_users(request):
    data = {}
    reqBody = request.data
    to=["f@du.edu"]
    if constants.TESTING:
        to=[constants.DEFAULT_TO_EMAIL]
    message = Mail(
        from_email=constants.DEFAULT_FROM_EMAIL,
        to_emails=to)
    message.bcc = Bcc("fernecorona@gmail.com")
    message.dynamic_template_data = { 
        'subject': reqBody["subject"],
        'body': reqBody["body"]
    }
    message.template_id = constants.CUSTOM_EMAIL_TEMPLATE
    try:
        sg = SendGridAPIClient(settings.EMAIL_HOST_PASSWORD)
        response = sg.send(message)
        code, body, headers = response.status_code, response.body, response.headers
        data["message"] = "messages successfully sent"
        data["success"] = True
        return Response(data) 
    except:
        data["message"] = "messages not successfully sent"
        data["success"] = False
        return Response(data, status = 404) 