from rest_framework import permissions


class IsAdmin(permissions.BasePermission): 
    def has_permission(self, request, view):
        if request.user.role_id == 1:
            return True


class IsSchoolStaff(permissions.BasePermission): 
    def has_permission(self, request, view): 
        if request.user.role_id == 3:
            return True

class IsDriver(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.role_id == 2:
            return True