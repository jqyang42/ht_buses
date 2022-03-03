from rest_framework import serializers
from .models import Location, Route, School, Stop, Student, User

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'first_name', 'last_name', 'school_id', 'student_school_id', 'route_id', 'user_id', 'in_range')

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ('id', 'name', 'school_id','description', 'is_complete', 'color_id')

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'name', 'location_id', 'arrival', 'departure')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'role', 'is_parent', 'location', 'phone_number')

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('id', 'address', 'lat', 'lng')

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = ('id', 'location_id', 'route_id', 'name', 'order_by', 'arrival', 'departure')
    