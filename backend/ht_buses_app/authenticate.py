from django.conf import settings
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import User

class AuthenticationBackend(BaseBackend):

    

    def authenticate(self, email, password):    
        try:
            user = User.objects.get(email=email)
    
            if user.check_password(password):
                return user
            else:
                return None
        except User.DoesNotExist:
            raise ValueError('User does not exist')
        except Exception as e:
            raise ValueError(e)

    def get_user(self, email):
        try:
            user = User.objects.get(email=email)
            return user
        except User.DoesNotExist:
            raise ValueError('User does not exist')
