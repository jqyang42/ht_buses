from ...models import User, Student 
from ..general.general_tools import has_access_to_object
from guardian.shortcuts import assign_perm, get_objects_for_user
from ..accounts import activate_account

def create_student_account(student_object, student_email): 
    #add check for valid email, maybe add phone number
    data = {}
    if student_email == "":
        data["success"] = False
        return data
    try:
        password = "asdfASDF5678" #account_tools.generate_random_password()
        parent = student_object.user_id
        student_user = User.objects.create_user(email=student_email, first_name=student_object.first_name, last_name=student_object.last_name, address= parent.location.address , password=password, lat=parent.location.lat, lng=parent.location.lng, role=User.STUDENT, phone_number = '1234')
        email_data = activate_account.send_account_activation_email(student_user)
        email_sent = email_data["success"]
        #assign_perm("view_user", student_object, student_user) will need to add parameter to student object 
        assign_perm("view_student", student_user, student_object)
        data["message"] = "student account was created"
        data["success"] = True
        data["student_user"] = {"first_name": student_user.first_name, "last_name": student_user.last_name, "email": student_user.email}
        return data
    except:
        data["message"] = "student user account not created"
        data["success"] = False
        data["student_user"] = {"first_name": "None", "last_name": "None", "email": "None"}
        return data 

def get_students_user(student_object):
    #find another way to do this 
    return User.objects.none()

def get_students_email(student_object):
    student_user = get_students_user(student_object)
    try:
        email = student_user.email 
    except:
        return ""

def update_students_user(student_object, student_email):
    student_user = get_students_user(student_object)
    if student_user is not None:
        student_user.first_name = student_object.first_name
        student_user.last_name = student_object.last_name
        student_user.email = student_email
        student_user.location = student_object.user_id.location
        student_user.save()
        return True
    return False 
    