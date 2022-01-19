from django.shortcuts import render
from django.http import HttpResponse
from .request import authenticate_user

def index(request):
    if request.POST == "POST":
        email = request.POST['email']
        password = request.POST['password']
        result = authenticate_user(email, password)
        print(result)
        return render(request, 'index.html', {})
    return render(request, 'index.html', {})

def students(request):
    return render(request, 'students.html', {})

def signup(request):
    return render(request, 'signup.html', {})

def schools(request):
    return render(request, 'schools.html', {})

def routes(request):
    return render(request, 'routes.html', {})

def users(request):
    return render(request, 'users.html', {})


