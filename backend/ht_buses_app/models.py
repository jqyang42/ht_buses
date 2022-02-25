from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import datetime

class Location(models.Model):
    address = models.CharField(max_length=100)
    lat = models.FloatField(default=0)
    lng = models.FloatField(default=0)
    locationTables = models.Manager()

class School(models.Model):
    name = models.CharField(max_length=100)
    location_id = models.ForeignKey('Location', default=None, on_delete=models.SET(None), blank=True, null=True)
    arrival = models.TimeField(default=datetime.time(00,00))
    departure = models.TimeField(default=datetime.time(00,00))
    schoolsTable = models.Manager()

class Route(models.Model):
    name = models.CharField(max_length=50)
    school_id = models.ForeignKey('School', default=None, on_delete=models.CASCADE)
    description = models.CharField(max_length=500)
    is_complete = models.BooleanField(default=False)
    color_id = models.IntegerField(default=0)
    routeTables = models.Manager()
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
    studentsTable = models.Manager()
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
    stopTables = models.Manager()
    class Meta:
        indexes = [
            models.Index(fields=['route_id'])
        ]

class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name,is_parent, address, password, lat, lng):
        if not email:
            raise ValueError('Users must have email address')
        if not first_name:
            raise ValueError('Users must have a first name')
        if not last_name:
            raise ValueError('Users must have a last name')
        if is_parent is True and not address:
                raise ValueError('Users must have an address')
        location_obj = Location.locationTables.create(address=address, lat=lat, lng=lng)
        user = self.model(
            email= self.normalize_email(email),
            first_name = first_name,
            last_name = last_name,
            is_parent = is_parent,
            )
        user.location_id = location_obj.id
        user.set_password(password)
        user.save(using= self._db)
        return user 
       
    def create_superuser(self, email, first_name, last_name, is_parent, password, address="", lat=0, lng=0):
        user = self.create_user(email, first_name, last_name, is_parent, address, password, lat, lng)
        user.is_staff = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(verbose_name='email',unique=True,max_length=128)
    is_staff = models.BooleanField(default=False)
    is_parent = models.BooleanField(default=False)
    location = models.ForeignKey('Location', default=None, on_delete=models.CASCADE, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'is_parent']
    objects = UserManager()


    