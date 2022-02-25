import json
from rest_framework.test import APIClient, APITestCase
from django.core.exceptions import ValidationError
from ...models import UserManager, School, Route, User, Student


class Test_students(APITestCase):
    endpoint = '/student/create'
    endpoint2 = '/student/edit?id=1'
    endpoint3 = '/student/delete'
    # Load login json
    def info(path):
        with open(path) as f:
            return json.load(f)

    def make_school(name):
        school = School.objects.create(name = name, address = "90 East Ave")
        return school

    def make_route():
        route  = Route.objects.create(name = "Hilly Route", school_id = School.objects.get(name = "East Middle School") , description = "Here is a description")
        return route

    def test_student_creation(self):
        school = Test_students.make_school("East Middle School")
        route = Test_students.make_route()
        user = User.objects.create(email= "kangaroo@du.com", first_name="John", last_name="Smith",is_parent= True, address= "80th Ave.", password = "HelloKitty")

        response = APIClient().post(self.endpoint, data = Test_students.info("ht_buses_app/tests/resources/students/create.json"), format='json')
        assert Student.studentsTable.filter(first_name = "Henry", last_name = "Smith", school_id = school).count() > 0
        assert response.status_code == 200 

    def test_student_edit(self):
        school = Test_students.make_school("East Middle School")
        school2 = Test_students.make_school("North Middle School")
        route = Test_students.make_route()
        user = User.objects.create(email= "kangaroo@du.com", first_name="John", last_name="Smith",is_parent= True, address= "80th Ave.", password = "HelloKitty")
        user2 = User.objects.create(email= "kangy@du.com", first_name="Gary", last_name="First",is_parent= True, address= "91th Ave.", password = "HelloKitty")
        student = Student.studentsTable.create(first_name="Hello", last_name="Kitty", school_id=school, user_id=user, student_school_id= 9876, route_id=route)
        endpoint2 = 'student/edit'
        response2 = APIClient().put(self.endpoint2, data = Test_students.info("ht_buses_app/tests/resources/students/edit.json"), format='json')
        assert Student.studentsTable.filter(first_name = "Not Henry", last_name = "Not Smith", student_school_id = 1234).count() > 0
        assert response2.status_code == 200 

    def test_student_delete(self):
        school = Test_students.make_school("East Middle School")
        route = Test_students.make_route()
        user = User.objects.create(email= "kangaroo@du.com", first_name="John", last_name="Smith",is_parent= True, address= "80th Ave.", password = "HelloKitty")
        response = APIClient().post(self.endpoint, data = Test_students.info("ht_buses_app/tests/resources/students/create.json"), format='json')
        assert Student.studentsTable.filter(first_name = "Henry", last_name = "Smith", school_id = school).count() > 0
        response3 = APIClient().post(self.endpoint3, data = Test_students.info("ht_buses_app/tests/resources/students/delete.json"), format='json')
        assert Student.studentsTable.filter(first_name = "Henry", last_name = "Smith", school_id = school).count() == 0
        assert response3.status_code == 200 
    
        



 
  