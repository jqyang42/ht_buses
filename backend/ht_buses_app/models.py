from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import datetime
from django.core.validators import RegexValidator
from django.contrib.auth.models import PermissionsMixin 
from . groups import get_admin_group, get_driver_group
from guardian.shortcuts import assign_perm

class Location(models.Model):
    address = models.CharField(max_length=150)
    lat = models.FloatField(default=0)
    lng = models.FloatField(default=0)
    objects = models.Manager()

class School(models.Model):
    name = models.CharField(max_length=100)
    location_id = models.ForeignKey('Location', default=None, on_delete=models.SET(None), blank=True, null=True)
    arrival = models.TimeField(default=datetime.time(00,00))
    departure = models.TimeField(default=datetime.time(00,00))
    objects = models.Manager()
    class Meta:
        permissions = (
                       ("view", "can view school"),
                       ("change", "can edit school"),
                       ("delete", "can delete school"),
                        ("add", "can create school"),
                      )

class Bus(models.Model):
    bus_number = models.IntegerField(default=0)
    last_updated = models.DateTimeField(default=datetime.datetime.now, blank=True)
    location_id = models.ForeignKey('Location', default=None, on_delete=models.CASCADE, blank=True, null=True)
    is_running = models.BooleanField(default=False)


class Route(models.Model):
    name = models.CharField(max_length=50)
    school_id = models.ForeignKey('School', default=None, on_delete=models.CASCADE)
    description = models.CharField(max_length=500)
    is_complete = models.BooleanField(default=False)
    color_id = models.IntegerField(default=0)
    objects = models.Manager()
    class Meta:
        indexes = [
            models.Index(fields=['school_id'])
        ]
        permissions = (
                       ("view", "can view route"),
                       ("change", "can edit route"),
                       ("delete", "can delete route"),
                        ("add", "can create route"),
                      )

class Log(models.Model):
    route_id = models.ForeignKey('Route', default=None, on_delete=models.CASCADE)
    bus_number = models.IntegerField(default=0)
    user_id = models.ForeignKey('User', default=None, on_delete=models.SET(None), blank=True, null=True)
    date = models.DateField(default=datetime.date.today, blank=True)
    start_time = models.TimeField(default=datetime.time(00,00), blank=True)
    duration = models.DurationField(default=datetime.timedelta(hours=0))
    pickup = models.BooleanField(default=False)

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    school_id = models.ForeignKey('School', default=None, on_delete=models.CASCADE)
    student_school_id = models.IntegerField(default=0)
    route_id = models.ForeignKey('Route', default=None, on_delete=models.SET(None), blank=True, null=True)
    user_id = models.ForeignKey('User', default=None, on_delete=models.CASCADE) 
    in_range = models.BooleanField(default=False)
    objects = models.Manager()
    class Meta:
        indexes = [
            models.Index(fields=['route_id']),
            models.Index(fields=['school_id']),
            models.Index(fields=['user_id'])
        ]
        permissions = (
                       ("view", "can view student"),
                       ("change", "can edit student"),
                       ("delete", "can delete student"),
                        ("add", "can create student"),
                      )

class Stop(models.Model):
    location_id = models.ForeignKey('Location', default=None, on_delete=models.CASCADE, blank=True, null=True)
    route_id = models.ForeignKey('Route', default=None, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    order_by = models.IntegerField(default=None)
    arrival = models.TimeField(default=datetime.time(00,00))
    departure = models.TimeField(default=datetime.time(00,00))
    objects = models.Manager()
    class Meta:
        indexes = [
            models.Index(fields=['route_id'])
        ]
        permissions = (
                       ("view", "can view stop"),
                       ("change", "can edit stop"),
                       ("delete", "can delete stop"),
                        ("add", "can create stop"),
                      )

class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name,is_parent, address, password, lat, lng, role, phone_number):
        if not email:
            raise ValueError('Users must have email address')
        if not first_name:
            raise ValueError('Users must have a first name')
        if not last_name:
            raise ValueError('Users must have a last name')
        if is_parent is True and not address:
                raise ValueError('Users must have an address')
        email = email.lower()
        location_obj = Location.objects.create(address=address, lat=lat, lng=lng)
        user = self.model(
            email= self.normalize_email(email),
            first_name = first_name,
            last_name = last_name,
            is_parent = is_parent,
            phone_number = phone_number
            )
        user.location_id = location_obj.id
        user.set_password(password)
        
        if role < 5 and role > 0:
            user.role = role
            user.save()
            if role == User.ADMIN:
                user.groups.add(get_admin_group())
                assign_perm("change_user", user, user)
            #elif role == 2:
            #user.groups.add(school_staff_group)
            elif role == User.DRIVER:
                user.groups.add(get_driver_group())
        else:
            user.role = User.GENERAL
        assign_perm("view_user", user, user)
        user.save(using= self._db)
        return user 
       
    def create_superuser(self, email, first_name, last_name, is_parent, password, address="", lat=0, lng=0,phone_number=None):
        user = self.create_user(email, first_name, last_name, is_parent, address, password, lat, lng, role=User.ADMIN, phone_number=phone_number)
        user.role = User.ADMIN
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    ADMIN = 1
    SCHOOL_STAFF = 2
    DRIVER = 3
    GENERAL = 4
    STUDENT = 5
    role_choices = (
        (ADMIN, "Administrator"),
        (SCHOOL_STAFF, "School Staff"),
        (DRIVER, "Driver"),
        (GENERAL, "General"),
        (STUDENT, "Student")
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(verbose_name='email',unique=True,max_length=254)
    phone_number = models.CharField(max_length=18, default=None, blank=True, null=True)
    role = models.PositiveSmallIntegerField(choices=role_choices, default=GENERAL)
    location = models.ForeignKey('Location', default=None, on_delete=models.CASCADE, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'is_parent', 'phone_number']
    objects = UserManager()
    class Meta:
        permissions = (
                       ("view", "can view user"),
                       ("change", "can edit user"),
                       ("delete", "can delete user"),
                        ("add", "can create user"),
                      )



    