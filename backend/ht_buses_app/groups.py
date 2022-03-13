from django.db import models
from django.contrib.auth.models import Group
from django.contrib.contenttypes.models import ContentType

school_staff_group, created = Group.objects.get_or_create(name='SchoolStaff')
admin_group, created = Group.objects.get_or_create(name='Admin')
bus_driver_group, created = Group.objects.get_or_create(name='BusDriver')
general_group, created = Group.objects.get_or_create(name='General')
