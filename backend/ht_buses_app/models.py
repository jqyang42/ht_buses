from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import datetime
from django.core.validators import RegexValidator

class Location(models.Model):
    address = models.CharField(max_length=100)
    lat = models.FloatField(default=0)
    lng = models.FloatField(default=0)
    objects = models.Manager()

class School(models.Model):
    name = models.CharField(max_length=100)
    location_id = models.ForeignKey('Location', default=None, on_delete=models.SET(None), blank=True, null=True)
    arrival = models.TimeField(default=datetime.time(00,00))
    departure = models.TimeField(default=datetime.time(00,00))
    objects = models.Manager()

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
        location_obj = Location.objects.create(address=address, lat=lat, lng=lng)
        user = self.model(
            email= self.normalize_email(email),
            first_name = first_name,
            last_name = last_name,
            is_parent = is_parent,
            phone_number = phone_number
            )
        if role == None:
            user.role = 0
        else:
            if role == "School Staff":
                user.role = User.SCHOOL_STAFF
            if role == "Driver":
                user.role = User.DRIVER
        user.location_id = location_obj.id
        user.set_password(password)
        user.save(using= self._db)
        return user 
       
    def create_superuser(self, email, first_name, last_name, is_parent, password, address="", lat=0, lng=0,):
        user = self.create_user(email, first_name, last_name, is_parent, address, password, lat, lng, role=None, phone_number=None)
        user.role = User.ADMIN
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    ADMIN = 1
    DRIVER = 2
    SCHOOL_STAFF = 3
    role_choices = (
        (ADMIN, "Administrator"),
        (DRIVER, "Driver"),
        (SCHOOL_STAFF, "School Staff")
    )
    role = models.PositiveSmallIntegerField(choices=role_choices, null=True, blank=True, default=0)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(verbose_name='email',unique=True,max_length=128)
    phoneNumberRegex = RegexValidator(regex = r"^\+?1?\d{8,15}$")
    phone_number = models.CharField(validators = [phoneNumberRegex], max_length=16, unique=True, default=None, blank=True, null=True)
    is_parent = models.BooleanField(default=False)
    role = models.PositiveSmallIntegerField(choices=role_choices)
    location = models.ForeignKey('Location', default=None, on_delete=models.CASCADE, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'is_parent']
    objects = UserManager()


    