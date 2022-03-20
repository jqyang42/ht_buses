
from django.core.exceptions import PermissionDenied
from ...models import School, User, Student, Route
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission
from guardian.shortcuts import assign_perm, remove_perm
from guardian.shortcuts import get_objects_for_user
from ...groups import get_driver_group, get_admin_group

def get_all_school_perms():
    school_content_type = ContentType.objects.get_for_model(School)
    return Permission.objects.filter(content_type=school_content_type)

def get_all_user_perms():
    user_content_type = ContentType.objects.get_for_model(User)
    return Permission.objects.filter(content_type=user_content_type)

def filtered_users_helper(students):
    user_ids = students.values_list('user_id', flat=True)
    return User.objects.filter(pk__in=user_ids)

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

def get_object_for_user(user, model_object, access_level):
    if user.has_perm('ht_buses_app.'+access_level):
        return model_object
    elif user.has_perm(access_level, model_object):
        return model_object
    else:
        raise PermissionDenied

def permission_setup():
    admin_perms = [*get_all_school_perms(), *get_all_user_perms()]
    get_admin_group().permissions.set(admin_perms)
    view_perms = [*get_all_school_perms().filter(codename__startswith='view_'), *get_all_user_perms().filter(codename__startswith='view_')]
    get_driver_group().permissions.set(view_perms)
    return 

def new_perms_to_many_objects(user, access_level, object_list): 
    for model_object in object_list:
        assign_perm(access_level, user, model_object)
    return 

def assign_school_staff_perms(user, schools):
    user.user_permissions.clear()
    user.groups.clear()
    remove_object_level_perms(user)
    user.save()
    user = User.objects.get(pk = user.pk)
    assign_school_perms(user, schools)
    for school in schools:
        students = Student.objects.filter(school_id = school)
        assign_user_perms(user, students)
    assign_perm("view_user", user, user)
    user.save()
    return 

def assign_school_perms(user, schools):
    for perm in get_all_school_perms():
        new_perms_to_many_objects(user, perm, schools)
    return 

def assign_student_perms(user, students):
    for perm in get_all_student_perms():
            new_perms_to_many_objects(user, perm, students)
    return 

def assign_user_perms(user, students):
    for perm in get_all_user_perms():
        print(user.first_name, students)
        new_perms_to_many_objects(user, perm, filtered_users_helper(students))
    return 
    
def reassign_after_creation(new_user):
    if user_is_parent(new_user.pk):
        students = Student.objects.filter(user_id = new_user)
        schools = filtered_schools_helper(students)
        return assign_right_to_users(schools, new_user)
    return False

def assign_right_to_users(schools, new_user):
    for school in schools:
        users_with_access = User.objects.filter(pk__in=[obj.pk for obj in User.objects.all() if obj.has_perm('change_school', school)])
        for user in users_with_access: 
            for perm in get_all_user_perms():
                assign_perm(perm, user, new_user)
    return True

def update_schools_staff_rights():
    school_staffs = User.objects.filter(role = User.SCHOOL_STAFF)
    for school_staff in school_staffs:
        assign_school_staff_perms(school_staff, get_objects_for_user(school_staff,"change_school", School.objects.all()))
    return True

def remove_perms_to_many_objects(user, access_level, object_list): 
    if object_list is not None:
        for model_object in object_list:
            remove_perm(access_level, user, model_object)
    return 

def remove_object_level_perms(user):
    #print(user.has_perm("view_school", School.objects.get(pk = 1) ))
    view_schools = get_objects_for_user(user,"view_school", School.objects.all())
    remove_perms_to_many_objects(user, "view_school", view_schools)

    change_schools = get_objects_for_user(user,"change_school", School.objects.all())
    remove_perms_to_many_objects(user, "change_school", change_schools)

    view_users = get_objects_for_user(user,"view_user", User.objects.all())
    remove_perms_to_many_objects(user, "view_user", view_users)

    change_users = get_objects_for_user(user,"change_user", User.objects.all())
    remove_perms_to_many_objects(user, "change_user", change_users)

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
    schools = School.objects.all()
    students = Student.objects.filter(school_id__in = schools)
    if user.role == User.DRIVER or user.role == User.ADMIN:
        return User.objects.all()
    if students.exists(): 
        return filtered_users_helper(students)
    else:
        return User.objects.none()


