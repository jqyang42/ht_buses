from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('students', views.students, name='students'),
    path('signup', views.signup, name="signup"),
    path('schools', views.schools, name="schools"),
    path('routes', views.routes, name="routes"),
    path('users', views.users, name="users"),
    path('routeplanner', views.routeplanner, name="routeplanner"),
]