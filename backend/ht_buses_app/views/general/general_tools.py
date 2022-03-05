from rest_framework.authtoken.models import Token
from ...models import User, Student

def user_is_parent(user_id):
    try:
        student_one = Student.objects.filter(pk = user.id)[0]
        return True
    except:
        return False
    return False

def role_string_to_id(role_string):
    if role_string == 'Administrator':
        return 1
    if role_string == 'BusDriver':
        return 2
    if role_string == 'SchoolStaff':
        return 3
    return None