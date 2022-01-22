from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import UserViewSet, LoginViewSet, RegistrationViewSet, RefreshViewSet, LogoutViewSet
from .views import User_login, User_logout
"""
routes = DefaultRouter(trailing_slash=False)

routes.register(r'signup', RegistrationViewSet, basename='auth-register')
routes.register(r'refresh', RefreshViewSet, basename='auth-refresh')
routes.register(r'', LoginViewSet, basename='auth-login')
"""

urlpatterns = [
    #path('', views.index, name='index'),
    # '''
    # path('students', views.students, name='students'),
    # path('signup', views.signup, name="signup"),
    # path('schools', views.schools, name="schools"),
    # path('routes', views.routes, name="routes"),
    # path('users', views.users, name="users"),
    # path('', include(('ht_buses_app.routers', 'ht_buses_app'), namespace='ht_buses_app-api')), # may need to change url paths
    # '''
    path('logout', User_logout, name="logout"),
    path('login', User_login, name="login"),
    #path('', include(routes.urls))
]

