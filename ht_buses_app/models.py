from django.db import models

from django.contrib.auth.models import User


class School(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    school_id = models.ForeignKey(School, default=0, on_delete=models.CASCADE)
    student_school_id = models.IntegerField(default=0)
    route_id = models.ForeignKey('Route', default=0, on_delete=models.SET(0))
    user_extended_id = models.ForeignKey('UserExtended', default=0, on_delete=models.CASCADE) 
    
    class Meta:
        indexes = [
            models.Index(fields=['route_id']),
            models.Index(fields=['school_id']),
            models.Index(fields=['user_extended_id'])
        ]

class Route(models.Model):
    name = models.CharField(max_length=25)
    school_id = models.ForeignKey(School, default=0, on_delete=models.CASCADE)
    description = models.CharField(max_length=500)
    class Meta:
        indexes = [
            models.Index(fields=['school_id'])
        ]

class UserExtended(models.Model):
    # use is_staff for admin login
    address = models.CharField(max_length=100)