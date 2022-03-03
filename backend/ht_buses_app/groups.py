from django.contrib.auth.models import Group

school_staff_group, created = Group.objects.get_or_create(name='SchoolStaff')
admin_group, created = Group.objects.get_or_create(name='Admin')
bus_driver_group, created = Group.objects.get_or_create(name='BusDriver')
general_group, created = Group.objects.get_or_create(name='General')

#TODO: Add group permissions to all but school_staff, general