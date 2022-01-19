from django.shortcuts import render
from django.http import HttpResponse

from .models import School, Route, Student, User


def index(request):
    if request.POST == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(email=email, password=password)
        if user is not None:
            return render(request, 'students.html', {})
        else:
            return render(request, 'students.html', {})
    return render(request, 'index.html', {})

def students(request):
    logged_in = True #change once login setup
    is_admin = False #change once login setup

    current_user = User.objects.filter(first_name = "Henry") #change once login setup

    if current_user.count() <= 0:
        createTempUser()
        current_user = User.objects.filter(first_name = "Henry")
    print(School.schoolsTable.all())
    print(Student.studentsTable.all())
    if logged_in:
        if is_admin:
            dictionary =  {'all_students': Student.studentsTable.all(), 'user_': current_user[0], 'displayParent': True }
            return render(request, 'students.html', dictionary)
        else: 
            dictionary =  {'all_students': Student.studentsTable.all(), 'user_': current_user[0], 'displayParent': False}
            return render(request, 'students.html', dictionary)

    else: 
        return render(request, 'students.html', {}) #change to login page if not logged in 

    return render(request, 'students.html', {}) #change to login page if not logged in 


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
     parent = User(first_name = "Henry", last_name= "Smuckers" , email='admin',password='admin',address = "90 East Ave",is_parent=False)
     parent.save()
     student = Student(first_name = "Peter", last_name = "Piper", school_id = school, student_school_id = 232, route_id = route, user_id = parent)
     student.save()