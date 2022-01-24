import json
from rest_framework.test import APIClient, APITestCase
from django.core.exceptions import ValidationError
from .test_user_create import Test_user_create
from .test_login import Test_user_login

class Test_user_logout(APITestCase):
    logout_endpoint = '/logout'
    create_endpoint = '/users/create'
    login_endpoint = '/login'

    # Load json files
    def logout_info(path):
        with open(path) as f:
            return json.load(f)

    # Tests
    # Currently broken: don't know how to pass the token so they can logout via code, manual testing this passes
    def test_user_logout_successful(self):
        APIClient().post(self.create_endpoint, data = Test_user_logout.logout_info("ht_buses_app/tests/resources/create_user/create_admin_user.json"), format='json')
        login_response = APIClient().post(self.login_endpoint, data = Test_user_logout.logout_info("ht_buses_app/tests/resources/login/login_req.json"), format='json')
        login_res = login_response.json()
        token = login_res["token"]
        req = {"token": token}
        print(login_res)
        print(req)
        response = APIClient().get(self.logout_endpoint, data = login_res, format='json')
        print(response.status_code)
        assert response.status_code == 302 # Checks that the response code is successful