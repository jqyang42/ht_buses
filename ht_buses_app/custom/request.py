from django.shortcuts import render
from django.http import HttpResponse
from .models import User
from django.contrib.auth import authenticate

# TODO: Figure out error: CSRF cookie not set (how to create token)
def authenticate_user(email, password):
    user = authenticate(email=email, password=password)
    if user is not None:
        return "true"
    else:
        return "false"

