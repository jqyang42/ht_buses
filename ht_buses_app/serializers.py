from rest_framework import serializers
from ht_buses_app.models import School

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('name', 'address')