from ...models import User
from ...constants import constants
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from sendgrid.helpers.mail import Mail
from sendgrid import SendGridAPIClient
from django.conf import settings




def account_setup_email(user):
    to=[user.email]
    if constants.TESTING:
        to=[constants.DEFAULT_TO_EMAIL]
    message = Mail(
        from_email=constants.DEFAULT_FROM_EMAIL,
        to_emails=to)
    message.dynamic_template_data = {
        'user_first': user.first_name,
        'user_last': user.last_name
    }
    message.template_id = constants.ACCOUNT_SETUP_TEMPLATE
    try:
        sg = SendGridAPIClient(settings.EMAIL_HOST_PASSWORD) 
        response = sg.send(message)
        code, body, headers = response.status_code, response.body, response.headers
    except Exception as e:
        print("Error: {0}".format(e))
    return str(response.status_code)