from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('students', views.students, name='students'),
    path('students_detail', views.students_detail, name="students_detail"),
    path('signup', views.signup, name="signup"),
    path('schools', views.schools, name="schools"),
    path('schools_detail', views.schools_detail, name="schools_detail"),
    path('routes', views.routes, name="routes"),
    path('routes_detail', views.routes_detail, name="routes_detail"),
    path('users', views.users, name="users"),
    path('users_detail', views.users_detail, name="users_detail"),
    path('routeplanner', views.routeplanner, name="routeplanner"),
]