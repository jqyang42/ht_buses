from .models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.core.exceptions import ObjectDoesNotExist

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id','email','first_name','last_name','is_staff','is_parent','address']
       
class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['user'] = UserSerializer(self.user).data
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data

class RegistrationSerializer(UserSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)
    email = serializers.EmailField(required=True, write_only=True, max_length=128)

    class Meta:
        model = User
        fields = ['email','first_name','last_name','is_staff','is_parent','address',]

    def create(self, validated_data):
        try:
            user = User.objects.get(email=validated_data['email'])
            raise ValueError('This user already exists')
        except ObjectDoesNotExist:
            # Create person --> parent or admin
            if validated_data['is_staff']:
                user = User.objects.create_superuser(**validated_data)
            else:
                user = User.objects.create_user(**validated_data)
                # TODO: create students and map to parent
        return user


