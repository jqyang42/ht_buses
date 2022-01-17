from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'index.html', {})

def students(request):
    return render(request, 'students.html', {})

def signup(request):
    return render(request, 'signup.html', {})