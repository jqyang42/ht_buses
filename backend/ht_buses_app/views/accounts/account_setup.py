from ...models import User
from ...constants import constants
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.conf import settings

def account_setup_email(user):
    to=[user.email]
    return