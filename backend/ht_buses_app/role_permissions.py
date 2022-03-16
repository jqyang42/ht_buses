from rest_framework import permissions
from .models import User


class IsAdmin(permissions.BasePermission): 
    def has_permission(self, request, view):
        if request.user.role == User.ADMIN:
            return True

class IsSchoolStaff(permissions.BasePermission): 
    def has_permission(self, request, view): 
        if request.user.role == User.SCHOOL_STAFF:
            return True

class IsDriver(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.role == User.DRIVER:
            return True