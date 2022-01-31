from rest_framework.routers import SimpleRouter
from .viewsets import UserViewSet, LoginViewSet, RegistrationViewSet, RefreshViewSet, LogoutViewSet
'''

routes = SimpleRouter()

# AUTHENTICATION

routes.register(r'signup', RegistrationViewSet, basename='auth-register')
routes.register(r'refresh', RefreshViewSet, basename='auth-refresh')
routes.register(r'logout', LogoutViewSet, basename='auth-logout')
routes.register(r'', LoginViewSet, basename='auth-login')
# USER

urlpatterns = [
    *routes.urls

]

'''

