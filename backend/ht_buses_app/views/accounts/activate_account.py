from ...models import User
from ...constants import constants
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.conf import settings
#from django.utils.crypto import get_random_string


#Used to determimne whether or not to show account activation page   
def valid_account_activation_url(request):
    return 

#api for activating a user 
def activate_account(request):
    return 
    #make sure valid_account_activate_url true
    #set user password, save
