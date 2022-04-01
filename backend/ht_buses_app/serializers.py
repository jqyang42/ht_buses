from rest_framework import serializers
from .models import Bus, Location, Log, Route, School, Stop, Student, User

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
        fields = ('id', 'first_name', 'last_name', 'email', 'role', 'location', 'phone_number')

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('id', 'address', 'lat', 'lng')

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = ('id', 'location_id', 'route_id', 'name', 'order_by', 'arrival', 'departure')

class BulkImportUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'location', 'phone_number')

class ManageSchoolsSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'name')

class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ('id', 'route_id', 'bus_number', 'user_id', 'date', 'start_time', 'duration', 'pickup')

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = ('id','bus_number','last_updated','location_id','is_running')
    