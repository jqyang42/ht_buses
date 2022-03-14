from django.db import models
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType

def setup_groups():
    school_staff_group, created = Group.objects.get_or_create(name='SchoolStaff')
    admin_group, created = Group.objects.get_or_create(name='Admin')
    bus_driver_group, created = Group.objects.get_or_create(name='BusDriver')
    general_group, created = Group.objects.get_or_create(name='General')
    return 

def get_admin_group():
    setup_groups()
    admin_group, created = Group.objects.get_or_create(name='Admin')
    return admin_group

def get_driver_group():
    setup_groups()
    bus_driver_group, created = Group.objects.get_or_create(name='BusDriver')
    return bus_driver_group



