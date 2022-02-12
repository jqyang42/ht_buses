from ...models import User
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.parsers import json
from django.core.mail import EmailMessage

@csrf_exempt
@permission_classes([IsAdminUser])
def account_creation_email(user):
    email_subject = "Activate you account"
    email_body = "Please go to this link to activate your account"
    email = EmailMessage(
        email_subject, 
        email_body,
        'noreply@ht_buses.com',
        ['fernecorona@gmail.com'],
    )
    email.send(fail_silently = False)
    return 

