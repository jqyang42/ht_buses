import json
from rest_framework.test import APIClient, APITestCase
from django.core.exceptions import ValidationError
from ..models import UserManager, School, Route


class Test_schools(APITestCase):
    endpoint = '/school/create'
    endpoint2 = '/school/edit'
    # Load login json
    def info(path):
        with open(path) as f:
            return json.load(f)

    def make_school(name):
        school = School.objects.create(name = name, address = "90 East Ave")
        return school

    def make_route(school):
        route  = Route.objects.create(name = "East Route", school_id = school , description = "Here is a description")
        return route

    def test_school_creation(self):
        response = APIClient().post(self.endpoint, data = Test_schools.info("ht_buses_app/tests/resources/schools/school_creation.json"), format='json')
        assert School.objects.filter(name = "Westie School").count() > 0
        assert School.objects.get(name = "Westie School").address == "87 Sixty St"
        assert response.status_code == 200 

    def test_school_edit(self):
        Test_schools.make_school("East Middle School")
        assert School.objects.filter(name = "East Middle School").count() > 0
        response = APIClient().post(self.endpoint2, data = Test_schools.info("ht_buses_app/tests/resources/schools/school_edit.json"), format='json')
        assert School.objects.filter(name = "East Middle School").count() == 0
        assert School.objects.filter(name = "Not East School").count() > 0
        assert response.status_code == 200 # Checks that the response code is successful

    def test_school_details(self):
        return
