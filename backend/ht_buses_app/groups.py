from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType

school_staff_group, created = Group.objects.get_or_create(name='SchoolStaff')
admin_group, created = Group.objects.get_or_create(name='Admin')
bus_driver_group, created = Group.objects.get_or_create(name='BusDriver')
general_group, created = Group.objects.get_or_create(name='General')


school_content_type = ContentType.objects.get_for_model(School)
all_school_perms = Permission.objects.filter(content_type=school_content_type)

user_content_type = ContentType.objects.get_for_model(School)
all_user_perms = Permission.objects.filter(content_type=user_content_type)

student_content_type = ContentType.objects.get_for_model(Student)
all_student_perms = Permission.objects.filter(content_type=student_content_type)

route_content_type = ContentType.objects.get_for_model(Route)
all_route_perms = Permission.objects.filter(content_type=route_content_type)

admin_group.permissions.set(all_school_perms)
admin_group.permissions.set(all_student_perms)
admin_group.permissions.set(all_route_perms)
admin_group.permissions.set(all_user_perms)
print(all_school_perms)

view_perms = Permission.objects.filter(codename__startswith='view_')
print(view_perms)
bus_driver_group.permissions.set(view_perms)

"""

#TODO: Add group permissions to all but school_staff, general
"""