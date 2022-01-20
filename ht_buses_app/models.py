from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class School(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    schoolsTable = models.Manager()

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    school_id = models.ForeignKey(School, default=0, on_delete=models.CASCADE)
    student_school_id = models.IntegerField(default=0)
    route_id = models.ForeignKey('Route', default=0, on_delete=models.SET(0))
    user_id = models.ForeignKey('User', default=0, on_delete=models.CASCADE) 
    studentsTable = models.Manager()
    class Meta:
        indexes = [
            models.Index(fields=['route_id']),
            models.Index(fields=['school_id']),
            models.Index(fields=['user_id'])
        ]

class Route(models.Model):
    name = models.CharField(max_length=25)
    school_id = models.ForeignKey(School, default=0, on_delete=models.CASCADE)
    description = models.CharField(max_length=500)
    routeTables = models.Manager()
    class Meta:
        indexes = [
            models.Index(fields=['school_id'])
        ]

# Relook at this
class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name,is_parent, address, password):
        if not email:
            raise ValueError('Users must have email address')
        if not first_name:
            raise ValueError('Users must have a first name')
        if not last_name:
            raise ValueError('Users must have a last name')
        if is_parent is True and not address:
                raise ValueError('Users must have an address')
        user = self.model(
            email= self.normalize_email(email),
            first_name = first_name,
            last_name = last_name,
            address = address,
            is_parent = is_parent
            )
        print(password)
        user.set_password(password)
        user.save(using= self._db)
        return user 
       
    def create_superuser(self, email, first_name, last_name, is_parent, address, password):
        user = self.create_user(email, first_name, last_name, is_parent,address, password)
        user.is_staff = True
        user.save(using=self._db)
        return user
               
class User(AbstractBaseUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(verbose_name='email',unique=True)
    is_staff = models.BooleanField(default=False)
    is_parent = models.BooleanField(default=False)
    if is_parent:
        address = models.CharField(max_length=100)
    else: 
        address = " "

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'is_parent']
    


    objects = UserManager()


    