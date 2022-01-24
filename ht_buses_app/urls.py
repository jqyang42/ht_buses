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
    #path('signup', views.signup, name="signup"),
    path('schools', views.schools, name="schools"),
    path('schools/detail', views.schools_detail, name="schools_detail"),
    path('schools/create', views.schools_create, name="schools_create"),
    path('schools/edit', views.schools_edit, name="schools_edit"),
    path('routes', views.routes, name="routes"),
    path('routes/detail', views.routes_detail, name="routes_detail"),
    path('routes/edit', views.routes_edit, name="routes_edit"),
    path('users', views.users, name="users"),
    path('users/detail', views.users_detail, name="users_detail"),
    path('users/create', views.signup, name="users_create"),
    path('users/edit', views.users_edit, name="users_edit"),
    path('routeplanner', views.routeplanner, name="routeplanner"),
    path('logout', views.User_logout, name="logout"),
    path('login', views.User_login, name="login"),
    path('', views.User_login, name="index"),
]
