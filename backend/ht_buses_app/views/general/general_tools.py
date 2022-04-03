
from django.core.exceptions import PermissionDenied
from ...models import School, User, Student, Route, Location
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission
from guardian.shortcuts import assign_perm, remove_perm
from guardian.shortcuts import get_objects_for_user
from ...groups import get_driver_group, get_admin_group


def filtered_users_helper(students):
    user_ids = students.values_list('user_id', flat=True)
    student_users = students.values_list('account', flat=True)
    return User.objects.filter(pk__in=user_ids) | User.objects.filter(pk__in=student_users)

def filtered_schools_helper(students):
    school_ids = students.values_list('school_id', flat=True)
    return School.objects.filter(pk__in=school_ids)

def user_is_parent(user_id):
    try:
        student_one = Student.objects.filter(user_id = user_id)[0]
        return True
    except:
        return False
    return False

def get_role_string(role_id):
    return User.role_choices[int(role_id)-1][1]

def role_string_to_id(role_string):
    if role_string == 'Administrator':
        return User.ADMIN
    if role_string == 'School Staff':
        return User.SCHOOL_STAFF
    if role_string == 'Bus Driver':
        return User.DRIVER
    if role_string == 'General':
        return User.GENERAL
    return None

"""
def get_object_for_user(user, model_object, access_level):
    if user.has_perm('ht_buses_app.'+access_level):
        return model_object
    elif user.has_perm(access_level, model_object):
        return model_object
    else:
        raise PermissionDenied
"""

def get_all_school_perms():
    school_content_type = ContentType.objects.get_for_model(School)
    return Permission.objects.filter(content_type=school_content_type)

def permission_setup():
    admin_perms = [*get_all_school_perms()]
    get_admin_group().permissions.set(admin_perms)
    view_perms = [*get_all_school_perms().filter(codename__startswith='view_')]
    get_driver_group().permissions.set(view_perms)
    return 

def new_perms_to_many_objects(user, access_level, object_list): 
    for model_object in object_list:
        assign_perm(access_level, user, model_object)
    return 

def assign_school_staff_perms(user, schools):
    user.user_permissions.clear()
    remove_object_level_perms(user)
    user.groups.clear()
    user.save()
    user = User.objects.get(pk = user.pk)
    assign_school_perms(user, schools)
    user.save()
    return 

def assign_school_perms(user, schools):
    for perm in get_all_school_perms():
        new_perms_to_many_objects(user, perm, schools)
    return 

def remove_perms_to_many_objects(user, access_level, object_list): 
    if object_list is not None:
        for model_object in object_list:
            remove_perm(access_level, user, model_object)
    return 

def remove_object_level_perms(user):

    view_schools = get_objects_for_user(user,"view_school", School.objects.all())
    remove_perms_to_many_objects(user, "view_school", view_schools)

    change_schools = get_objects_for_user(user,"change_school", School.objects.all())
    remove_perms_to_many_objects(user, "change_school", change_schools)

    return 

def reassign_perms(edited_user, schools=[]):
    edited_user.user_permissions.clear()
    edited_user.save()
    edited_user = User.objects.get(pk = edited_user.pk)
    remove_object_level_perms(edited_user)
    if edited_user.role == User.SCHOOL_STAFF:
        try:
            school_ids = schools
            managed_schools = School.objects.filter(pk__in=school_ids)
            assign_school_staff_perms(edited_user, managed_schools) 
        except:
            return False
    reassign_groups(edited_user)
    assign_perm("view_user", edited_user, edited_user)
    edited_user.save()
    return True 

def reassign_groups(edited_user):
    edited_user.groups.clear()
    edited_user.save()
    if edited_user.role == User.ADMIN:
        edited_user.groups.add(get_admin_group())
    elif edited_user.role == User.DRIVER:
        edited_user.groups.add(get_driver_group())
    edited_user.save()
    return True

def get_users_for_user(user):
    schools = get_objects_for_user(user,"change_school", School.objects.all())
    students = Student.objects.filter(school_id__in = schools)
    if user.role == User.DRIVER or user.role == User.ADMIN:
        return User.objects.all()
    if students.exists(): 
        return filtered_users_helper(students)
    else:
        return User.objects.none()

def get_users_with_address(user):
    users = User.objects.filter(role = User.GENERAL)
    user_location_ids = users.values_list('location', flat=True)
    locations_with_address = Location.objects.filter(pk__in = user_location_ids).exclude(address = "")
    if user.role == User.ADMIN or user.role == User.DRIVER:
        return users.filter(location__in = locations_with_address)
    if user.role == User.SCHOOL_STAFF:
        staff_general_users = get_users_for_user(user).filter(role = User.GENERAL)
        return staff_general_users.filter(location__in = locations_with_address)
    return User.objects.none()
        

def get_students_for_user(user):
    try:
        if user.role == User.ADMIN or user.role == User.SCHOOL_STAFF:
            schools = get_objects_for_user(user, "change_school", School.objects.all())
        else:
            schools = get_objects_for_user(user, "view_school", School.objects.all())
        return Student.objects.filter(school_id__in = schools)
    except:
        return Student.objects.none()

def has_access_to_object(user, model_object):
    if user.role == User.ADMIN or user.role == User.DRIVER:
        return model_object
    schools = get_objects_for_user(user,"change_school", School.objects.all())
    if user.role == User.SCHOOL_STAFF:
        schools = get_objects_for_user(user,"change_school", School.objects.all())
        try:
            if type(model_object) is Student:
                #schools.get(pk = model_object.school_id.pk)
                if schools.contains(model_object.school_id):
                    return model_object
            if type(model_object) is Route:
                #schools.get(pk = model_object.school_id.pk)
                if schools.contains(model_object.school_id):
                    return model_object
            if type(model_object) is User:
                try:
                    student = Student.objects.get(account = model_object)
                    student_user = student.account
                    if schools.contains(student.school_id):
                        return model_object
                except:
                    students = Student.objects.filter(user_id = model_object.pk)
                    for student in students:
                        try:
                            schools.get(pk = student.school_id.pk)
                            return model_object
                        except:
                            continue 
                    raise PermissionDenied
            if type(model_object) is School:
                schools.get(pk = model_object.pk)
                return model_object
        except:
            raise PermissionDenied



