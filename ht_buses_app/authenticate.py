from django.conf import settings
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import User

class SettingsBackend(BaseBackend):

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

    def get_user(self, user_id):
        try:
            user = User.objects.get(sys_id=user_id)
            return user
        except User.DoesNotExist:
            raise ValueError('User does not exist')
