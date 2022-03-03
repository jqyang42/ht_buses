from rest_framework.authtoken.models import Token
from ...models import User, Student

def user_is_parent(user_id):
    try:
        student_one = Student.objects.filter(pk = user.id)[0]
        return True
    except:
        return False
    return False