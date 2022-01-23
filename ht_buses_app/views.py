from django.shortcuts import render
from django.http import HttpResponse

from .models import School, Route, Student, User
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password

def index(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        
        user = authenticate(email=email, password=password)
        print(user)
        if user is not None:
            #login(request, user) #request.user
            logged_in = True
            f_name = user.first_name
            l_name = user.last_name
            return students(request, logged_in = True, user=user)
        else:
            return render(request, 'index.html', {})
    
    return render(request, 'index.html', {})

def students_detail(request):
    return render(request, 'students_detail.html', {})

def students(request, logged_in=False, user = None):

    if logged_in and user is not None:
        if user.is_staff:
            dictionary =  {'all_students': Student.studentsTable.all(), 'user_first': user.first_name, 'user_last': user.last_name}
            return render(request, 'students.html', dictionary)
        else: 
            dictionary =  {'all_students': Student.studentsTable.all(), 'user_first': user.first_name, 'user_last': user.last_name}
            return render(request, 'students.html', dictionary)

    else: 
        return render(request, 'index.html', {}) #change to login page if not logged in 
    
def students_edit(request):
    return render(request, 'students_edit.html', {})

def signup(request):
    return render(request, 'signup.html', {})

@api_view(['GET'])
def schools(request):

    return render(request, 'schools.html', {})

def schools_detail(request):
    return render(request, 'schools_detail.html', {})

def schools_create(request):
    return render(request, 'schools_create.html', {})

def schools_edit(request):
    return render(request, 'schools_edit.html', {})

def routes(request):
    return render(request, 'routes.html', {})

def routes_detail(request):
    return render(request, 'routes_detail.html', {})

def routes_edit(request):
    return render(request, 'routes_edit.html', {})

def users(request):
    return render(request, 'users.html', {})

def users_detail(request):
    return render(request, 'users_detail.html', {})

def users_create(request):
    return render(request, 'users_create.html', {})

def users_edit(request):
    return render(request, 'users_edit.html', {})

def routeplanner(request):
    return render(request, 'route_planner.html', {})
    
'''
# NOTE: To create a sample school, route, user, and parent for viewing , add to students, method uncomment below and :
    user = createTempUser()
    logged_in =  True
'''
'''
def createTempUser():
    school = School(name = "East", address = "56 Yellow Road")
    school.save()
    route = Route(name="Route 5", school_id = school,description="This is route 5" )
    route.save()
    parent = User(first_name = "John", last_name= "Garcia" , email='g@duke.edu',password='admin',address = "90 East Ave",is_parent=False, is_staff = True)
    parent = User.objects.get(email = parent.email)
    parent.save()
    student = Student(first_name = "Peter", last_name = "Piper", school_id = school, student_school_id = 232, route_id = route, user_id = parent)
    student.save()
    return parent
'''
