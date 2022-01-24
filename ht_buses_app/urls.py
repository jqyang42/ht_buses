from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import UserViewSet, LoginViewSet, RegistrationViewSet, RefreshViewSet, LogoutViewSet
from . import views

"""
routes = DefaultRouter(trailing_slash=False)

routes.register(r'signup', RegistrationViewSet, basename='auth-register')
routes.register(r'refresh', RefreshViewSet, basename='auth-refresh')
routes.register(r'', LoginViewSet, basename='auth-login')
"""

urlpatterns = [
    path('students', views.students, name='students'),
    path('students_detail', views.students_detail, name="students_detail"),
    path('students_edit', views.students_edit, name="students_edit"),
    path('signup', views.signup, name="signup"),
    path('schools', views.schools, name="schools"),
    path('schools_detail', views.schools_detail, name="schools_detail"),
    path('schools_create', views.schools_create, name="schools_create"),
    path('schools_edit', views.schools_edit, name="schools_edit"),
    path('routes', views.routes, name="routes"),
    path('routes_detail', views.routes_detail, name="routes_detail"),
    path('routes_edit', views.routes_edit, name="routes_edit"),
    path('users', views.users, name="users"),
    path('users_detail', views.users_detail, name="users_detail"),
    path('users_create', views.users_create, name="users_create"),
    path('users_edit', views.users_edit, name="users_edit"),
    path('routeplanner', views.routeplanner, name="routeplanner"),
    path('logout', views.User_logout, name="logout"),
    path('login', views.User_login, name="login"),
]
