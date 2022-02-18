from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from ...models import User
from ...constants import constants
from django.utils.encoding import force_bytes, force_str

activation_token_generator = PasswordResetTokenGenerator()
password_reset_token_generator = PasswordResetTokenGenerator()


def encode_user(user):
    return urlsafe_base64_encode(force_bytes(user.pk))

def decode_user(uuid):
    return force_str(urlsafe_base64_decode(uuid))


def account_activation_email(user):
    uuid = encode_user(user)
    account_activation_token = activation_token_generator.make_token(user)
    url = constants.ACCOUNT_ACTIVATION_URL_FRONTEND + str(uuid) + '&' + str(account_activation_token)
    print(url)
    return

def generate_random_password():
    #return get_random_string(length=18)
    return User.objects.make_random_password(length=18) 


def activation_params_valid(uuid, token):
    try:
        user = User.objects.get(pk=decode_user(uuid))
        valid_token = activation_token_generator.check_token(user, token) 
        return valid_token
    except: 
        return False

def password_reset_params_valid(uuid, token):
    try:
        user = User.objects.get(pk=decode_user(uuid))
        valid_token = password_reset_token_generator.check_token(user, token) 
        print(valid_token)
        return valid_token
    except:
        return False

