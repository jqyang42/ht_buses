from ... import groups
from django.core.exceptions import PermissionDenied
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission
from ...groups import bus_driver_group, admin_group
from ...models import School, User, Student, Route

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

def get_object_for_user(user, model_object, access_level):
    content_type = ContentType.objects.get_for_model(type(model_object))
    perm = Permission.objects.filter(content_type=content_type, codename__startswith=access_level+'_')
    if user.has_perm('ht_buses_app.'+access_level):
        return model_object
    else:
        raise PermissionDenied

def permission_setup():

    school_content_type = ContentType.objects.get_for_model(School)
    all_school_perms = Permission.objects.filter(content_type=school_content_type)

    user_content_type = ContentType.objects.get_for_model(User)
    all_user_perms = Permission.objects.filter(content_type=user_content_type)

    student_content_type = ContentType.objects.get_for_model(Student)
    all_student_perms = Permission.objects.filter(content_type=student_content_type)

    route_content_type = ContentType.objects.get_for_model(Route)
    all_route_perms = Permission.objects.filter(content_type=route_content_type)

    admin_perms = [*all_school_perms, *all_user_perms, *all_student_perms, *all_route_perms]
    #admin_perms = Permission.object.all()
    admin_group.permissions.set(admin_perms)

    view_perms = [*all_school_perms.filter(codename__startswith='view_'), *all_user_perms.filter(codename__startswith='view_'), *all_student_perms.filter(codename__startswith='view_'), *all_route_perms.filter(codename__startswith='view_')]
    bus_driver_group.permissions.set(view_perms)

