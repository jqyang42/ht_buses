from rest_framework import permissions
from .models import User


class IsAdmin(permissions.BasePermission): 
    def has_permission(self, request, view):
        try:
            if request.user.role == User.ADMIN:
                return True
            return False 
        except:
            False 

class IsSchoolStaff(permissions.BasePermission): 
    def has_permission(self, request, view): 
        try:
            if request.user.role == User.SCHOOL_STAFF:
                return True
            return False 
        except:
            False 

class IsDriver(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            if request.user.role == User.DRIVER:
                return True
            return False 
        except:
            return False

'''
class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            if request.user.role == User.STUDENT:
                return True
            return False 
        except:
            return False
'''