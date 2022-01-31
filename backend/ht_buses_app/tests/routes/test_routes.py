import json
from rest_framework.test import APIClient, APITestCase
from django.core.exceptions import ValidationError
from ...models import UserManager, School, Route


class Test_routes(APITestCase):
    endpoint = '/route/create'
    endpoint2 = '/route/edit'
    # Load login json
    def info(path):
        with open(path) as f:
            return json.load(f)

    def make_school(name):
        school = School.schoolsTable.create(name = name, address = "90 East Ave")
        return school

    def make_route():
        route  = Route.routeTables.create(name = "Route Star", school_id = School.schoolsTable.get(name = "East Middle School") , description = "Here is a description")
        return route

    def test_route_creation(self):
        Test_routes.make_school("East Middle School")
        response = APIClient().post(self.endpoint, data = Test_routes.info("ht_buses_app/tests/resources/routes/route_creation.json"), format='json')
        assert Route.routeTables.get(name = "Route 89") is not None
        assert response.status_code == 200 # Checks that the response code is successful

    def test_route_edit(self):
        Test_routes.make_school("East Middle School")
        Test_routes.make_route() 
        assert Route.routeTables.get(name = "Route Star") is not None
        Test_routes.make_school("North Middle School")
        response = APIClient().post(self.endpoint2, data = Test_routes.info("ht_buses_app/tests/resources/routes/route_edit.json"), format='json')
        route = Route.routeTables.get(name = "Star Route")
        assert route is not None
        assert route.school_id.name == "North Middle School"
        assert response.status_code == 200 # Checks that the response code is successful

    def test_route_details(self):
        return
