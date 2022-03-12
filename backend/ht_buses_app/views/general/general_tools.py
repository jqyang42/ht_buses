from ... import groups
from django.core.exceptions import PermissionDenied
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission
from ...groups import bus_driver_group, admin_group
from ...models import School, User, Student, Route
from guardian.shortcuts import assign_perm, remove_perm
from guardian.shortcuts import get_objects_for_user

school_content_type = ContentType.objects.get_for_model(School)
all_school_perms = Permission.objects.filter(content_type=school_content_type)

user_content_type = ContentType.objects.get_for_model(User)
all_user_perms = Permission.objects.filter(content_type=user_content_type)

student_content_type = ContentType.objects.get_for_model(Student)
all_student_perms = Permission.objects.filter(content_type=student_content_type)

route_content_type = ContentType.objects.get_for_model(Route)
all_route_perms = Permission.objects.filter(content_type=route_content_type)

def filtered_users_helper(students):
    user_ids = students.values_list('user_id', flat=True)
    return User.objects.filter(pk__in=user_ids)

def filtered_schools_helper(students):
    school_ids = students.values_list('school_id', flat=True)
    return School.objects.filter(pk__in=school_ids)

"""
def filtered_routes_helper(students):
    school = School.objects.filter()
    route_ids = .values_list('route_id', flat=True)
    return User.objects.filter(pk__in=route_ids)
"""

def user_is_parent(user_id):
    try:
        student_one = Student.objects.filter(user_id = user_id)[0]
        return True
    except:
        return False
    return False

def role_string_to_id(role_string):
    if role_string == 'Administrator':
        return 1
    if role_string == 'School Staff':
        return 2
    if role_string == 'Bus Driver':
        return 3
    if role_string == 'General':
        return 4
    return None

def get_object_for_user(user, model_object, access_level):
    print(user.has_perm(access_level, model_object))
    if user.has_perm('ht_buses_app.'+access_level):
        return model_object
    elif user.has_perm(access_level, model_object):
        return model_object
    else:
        raise PermissionDenied

def permission_setup():
    admin_perms = [*all_school_perms, *all_user_perms, *all_student_perms, *all_route_perms]
    #admin_perms = Permission.object.all()
    admin_group.permissions.set(admin_perms)
    view_perms = [*all_school_perms.filter(codename__startswith='view_'), *all_user_perms.filter(codename__startswith='view_'), *all_student_perms.filter(codename__startswith='view_'), *all_route_perms.filter(codename__startswith='view_')]
    bus_driver_group.permissions.set(view_perms)

def new_perms_to_many_objects(user, access_level, object_list): 
    for model_object in object_list:
        assign_perm(access_level, user, model_object)
    return 

def assign_school_staff_perms(user, schools):
    #current_perms = [*user.user_permissions.all()]
    user.user_permissions.clear()
    user.groups.clear()
    user.save()
    assign_school_perms(user, schools)
    for school in schools:
        students = Student.objects.filter(school_id = school)
        assign_student_perms(user, students)
        assign_user_perms(user, students)
        #assign_route_perms(user, students)
    user.save()
    return 

def assign_school_perms(user, schools):
    for perm in all_school_perms:
        new_perms_to_many_objects(user, perm, schools)
    return 

def assign_student_perms(user, students):
    for perm in all_student_perms:
            new_perms_to_many_objects(user, perm, students)
    return 

"""
def assign_route_perms(user, students):
    for perm in all_route_perms:
        new_perms_to_many_objects(user, perm, filtered_routes_helper(students))
    return 
"""

def assign_user_perms(user, students):
    for perm in all_user_perms:
        new_perms_to_many_objects(user, perm, filtered_users_helper(students))
    return 
    
def reassign_after_creation(new_user):
    if user_is_parent(new_user.pk):
        students = Student.objects.filter(user_id = new_user)
        schools = filtered_schools_helper(students)
        for school in schools:
            users_with_access = User.objects.filter(pk__in=[obj.pk for obj in User.objects.all() if obj.has_perm('change_school', school)])
            for user in users_with_access: 
                for perm in all_user_perms:
                    assign_perm(perm, user, new_user)
        return True
    return False