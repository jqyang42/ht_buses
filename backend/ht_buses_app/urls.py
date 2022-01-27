from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

"""
routes = DefaultRouter(trailing_slash=False)

routes.register(r'signup', RegistrationViewSet, basename='auth-register')
routes.register(r'refresh', RefreshViewSet, basename='auth-refresh')
routes.register(r'', LoginViewSet, basename='auth-login')
"""

urlpatterns = [
    path('students', views.students, name='students'),
    path('students/detail', views.students_detail, name="students_detail"),
    #path('students/edit', views.users_create, name="students_edit"),
    path('signup', views.signup, name="signup"),
    path('schools', views.schools, name="schools"),
    path('schools/detail', views.schools_detail, name="schools_detail"),
    path('schools/create', views.school_create, name="school_create"),
    path('schools/edit', views.school_edit, name="school_edit"),
    path('schools/delete', views.school_delete, name="school_delete"),
    #path('routes', views.routes, name="routes"),
    path('routes/detail', views.routes_detail, name="routes_detail"),
    path('routes/create', views.route_create, name="route_create"),
    path('routes/edit', views.route_edit, name="route_edit"),
    path('routes/delete', views.route_delete, name="route_delete"),
    path('users', views.users, name="users"),
    path('users/detail', views.users_detail, name="users_detail"),
    path('users/create', views.signup, name="users_create"),
    path('users/edit', views.user_edit, name="users_edit"),
    path('routeplanner', views.routeplanner, name="routeplanner"),
    path('logout', views.User_logout, name="logout"),
    path('login', views.User_login, name="login"),
    path('', views.User_login, name="index"),
    path('students/delete', views.single_student_delete, name = "delete_student"),
    path('students/edit', views.single_student_edit, name = "edit_student"),
    path('users/delete', views.user_delete, name = "delete_user"),
    path('users/edit', views.user_edit, name = "edit_user"),
]
