import './App.css';
import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './static/custom.css';

import Login from "./templates/index";
import ParentDashboard from './templates/parent-view/parent-dashboard';
import ParentDetail from './templates/parent-view/parent-detail';
import ChangePassword from './templates/general/change-password';
import Account from './templates/general/account';

import Students from "./templates/students/students";
import StudentsDetail from "./templates/students/students-detail";
import StudentsEdit from "./templates/students/students-edit";

import Schools from "./templates/schools/schools";
import SchoolsDetail from "./templates/schools/schools-detail";
import SchoolsCreate from "./templates/schools/schools-create";
import SchoolsEdit from "./templates/schools/schools-edit";

import Users from "./templates/users/users";
import UsersDetail from "./templates/users/users-detail";
import UsersCreate from "./templates/users/users-create";
import UsersEdit from "./templates/users/users-edit";
// import UsersPassword from './templates/users/users-password';

import BusRoutes from "./templates/routes/routes";
import BusRoutesDetail from "./templates/routes/routes-detail";
import BusRoutesPlanner from "./templates/routes/routes-planner";
import BusRoutesEdit from "./templates/routes/routes-edit";

import Email from './templates/components/email';
import EmailReset from './templates/general/email-reset';
import ErrorPage from './templates/error-page';
import ResetPassword from './templates/general/reset-password';

import { ACCOUNT_URL } from "./constants";
import { INDEX_URL } from "./constants";
import { LOGIN_URL } from "./constants";
import { SCHOOLS_URL } from "./constants";
import { STUDENTS_URL } from "./constants";
import { USERS_URL } from "./constants";
import { ROUTES_URL } from "./constants";
import { SCHOOLS_DETAIL_URL } from "./constants";
import { STUDENTS_DETAIL_URL } from "./constants";
import { USERS_DETAIL_URL } from "./constants";
import { ROUTES_DETAIL_URL } from "./constants";
import { SCHOOLS_CREATE_URL } from "./constants";
import { USERS_CREATE_URL } from "./constants";
import { ROUTES_PLANNER_URL } from "./constants";
import { SCHOOLS_EDIT_URL } from "./constants";
import { STUDENTS_EDIT_URL } from "./constants";
import { USERS_EDIT_URL } from "./constants";
// import { USERS_PASSWORD_URL } from './constants';
import { ROUTES_EDIT_URL } from "./constants";
import { SCHOOLS_EMAIL_URL } from './constants';
import { ROUTES_EMAIL_URL } from './constants';
import { PARENT_DASHBOARD_URL } from './constants';
import { PARENT_DETAIL_URL } from './constants';
import { PASSWORD_URL } from './constants';
import { USERS_EMAIL_URL } from './constants';
import { EMAIL_RESET_URL } from './constants';
import { RESET_PASSWORD_URL } from './constants';

class App extends Component {
  render() {
    return (
      <div>
        <Routes>
          <Route path={INDEX_URL} element={<Login />} />
          <Route path={LOGIN_URL} element={<Login />} />
          <Route path={PARENT_DASHBOARD_URL} element={<ParentDashboard />} />
          <Route path={PARENT_DETAIL_URL} element={<ParentDetail />} />
          <Route path={PASSWORD_URL} element={<ChangePassword />} />

          <Route path={STUDENTS_URL} element={<Students />} />
          <Route path={STUDENTS_DETAIL_URL} element={<StudentsDetail />} />
          <Route path={STUDENTS_EDIT_URL} element={<StudentsEdit />} />

          <Route path={SCHOOLS_URL} element={<Schools />} />
          <Route path={SCHOOLS_CREATE_URL} element={<SchoolsCreate />} />
          <Route path={SCHOOLS_DETAIL_URL} element={<SchoolsDetail  route={this.props.route} />} />
          <Route path={SCHOOLS_EDIT_URL} element={<SchoolsEdit />} />
          <Route path={SCHOOLS_EMAIL_URL} element={<Email source="School" />} />

          <Route path={USERS_URL} element={<Users />} />
          <Route path={USERS_CREATE_URL} element={<UsersCreate />} />
          <Route path={USERS_DETAIL_URL} element={<UsersDetail />} />
          <Route path={USERS_EDIT_URL} element={<UsersEdit />} />
          <Route path={USERS_EMAIL_URL} element={<Email source="Users" />} />

          <Route path={ROUTES_URL} element={<BusRoutes />} />
          <Route path={ROUTES_DETAIL_URL} element={<BusRoutesDetail />} />
          <Route path={ROUTES_PLANNER_URL} element={<BusRoutesPlanner />} />
          <Route path={ROUTES_EDIT_URL} element={<BusRoutesEdit />} />
          <Route path={ROUTES_EMAIL_URL} element={<Email source="Route" />} />

          <Route path={ACCOUNT_URL} element={<Account />} />
          <Route path={EMAIL_RESET_URL} element={<EmailReset />} />
          <Route path={RESET_PASSWORD_URL} element={<ResetPassword />} />
          <Route component={ErrorPage} />
        </Routes>
      </div>
    );
  }
}

export default App;
