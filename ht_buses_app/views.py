from django.shortcuts import render
from django.http import HttpResponse

from .models import School, Route, Student, UserExtended

def index(request):
    
    return render(request, 'index.html', {})

def students(request):

   
    logged_in = True #change once login setup
    is_admin = False #change once login setup

    current_user = UserExtended.allUsers.filter(first_name = "Mary") #change once login setup
    if current_user.count() < 0:
        user = createTempUser

    if logged_in:
        if is_admin:
            dictionary =  {'all_students': Student.studentsTable.all(), 'user_': current_user[0], 'displayParent': True }
            return render(request, 'students.html', dictionary)
        else: 
            dictionary =  {'all_students': Student.studentsTable.all(), 'user_': current_user[0], 'displayParent': False}
            return render(request, 'students.html', dictionary)

    else: 
        return render(request, 'students.html', {}) #change to login page if not logged in 

def signup(request):
    return render(request, 'signup.html', {})


def createTempUser():
    school = School(name = "East", address = "56 Yellow Road")
    school.save()
    route = Route(name="Route 5", school_id = school,description="This is route 5" )
    route.save()
    parent = UserExtended(first_name = "Mary", last_name= "Quiz" , address = "90 East Ave")
    parent.save()
    student = Student(first_name = "John", last_name = "Quiz", school_id = school, student_school_id = 232, route_id = route, user_extended_id = parent)
    student.save()
    return parent 