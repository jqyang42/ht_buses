from django.shortcuts import render
from django.http import HttpResponse

from .models import School, Route, Student, User
from django.contrib.auth import authenticate


def index(request):

    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        
        user = authenticate(email=email, password=password)
        current_user = User.objects.filter(first_name = "John") #change once login setup

        if current_user.count() <= 0:
            createTempUser()
            current_user = User.objects.filter(first_name = "John")
        user = current_user[0]

        if user is not None:
            logged_in = True
            admin_permissions = user.is_staff
            f_name = user.first_name
            l_name = user.last_name
            return students(request, logged_in = True, admin_permissions = admin_permissions, user=user)
        else:
            return render(request, 'index.html', {})
    
    return render(request, 'index.html', {})




def students(request, logged_in=False, admin_permissions=False, user = None):

    if logged_in and user is not None:
        if admin_permissions:
            dictionary =  {'all_students': Student.studentsTable.all(), 'user_first': user.first_name, 'user_last': user.last_name, 'displayParent': True }
            return render(request, 'students.html', dictionary)
        else: 
            dictionary =  {'all_students': Student.studentsTable.all(), 'user_first': user.first_name, 'user_last': user.last_name, 'displayParent': False}
            return render(request, 'students.html', dictionary)

    else: 
        return render(request, 'index.html', {}) #change to login page if not logged in 
    
def signup(request):
    return render(request, 'signup.html', {})


def schools(request):
    return render(request, 'schools.html', {})

def routes(request):
    return render(request, 'routes.html', {})

def users(request):
    return render(request, 'users.html', {})

#TODO: Why is student not getting saved
def createTempUser():
     school = School(name = "East", address = "56 Yellow Road")
     school.save()
     route = Route(name="Route 5", school_id = school,description="This is route 5" )
     route.save()
     parent = User(first_name = "John", last_name= "Garcia" , email='g@duke.edu',password='admin',address = "90 East Ave",is_parent=False)
     parent.save()
     student = Student(first_name = "Peter", last_name = "Piper", school_id = school, student_school_id = 232, route_id = route, user_id = parent)
     student.save()