from rest_framework import permissions


class IsAdmin(permissions.BasePermission): 
    def has_permission(self, request, view):
        if request.user.role == 1:
            return True


class IsSchoolStaff(permissions.BasePermission): 
    def has_permission(self, request, view): 
        if request.user.role == 4:
            return True

class IsDriver(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.role == 2:
            return True