// import HT_Logo from './static/img/HT_Logo.png';
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

import Students from "./templates/students/students";
import StudentsDetail from "./templates/students/students-detail";
import StudentsEdit from "./templates/students/students-edit";
// import StudentsDelete from "./templates/students-delete";

import Schools from "./templates/schools/schools";
import SchoolsDetail from "./templates/schools/schools-detail";
import SchoolsCreate from "./templates/schools/schools-create";
import SchoolsEdit from "./templates/schools/schools-edit";
// import SchoolsDelete from "./templates/schools-delete";

import Users from "./templates/users/users";
import UsersDetail from "./templates/users/users-detail";
import UsersCreate from "./templates/users/users-create";
import UsersEdit from "./templates/users/users-edit";
import UsersPassword from './templates/users/users-password';
// import UsersDelete from "./templates/users-delete";

import BusRoutes from "./templates/routes/routes";
import BusRoutesDetail from "./templates/routes/routes-detail";
import BusRoutesPlanner from "./templates/routes/routes-planner";
import BusRoutesEdit from "./templates/routes/routes-edit";
// import BusRoutesDelete from "./templates/routes-delete";

import { INDEX_URL } from "./constants";
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
import { USERS_PASSWORD_URL } from './constants';
import { ROUTES_EDIT_URL } from "./constants";
import { PARENT_DASHBOARD_URL } from './constants';
import { PARENT_DETAIL_URL } from './constants';

class App extends Component {
  render() {
    return (
      <div>
        <Routes>
          <Route path={INDEX_URL} element={<Login />} />
          <Route path={PARENT_DASHBOARD_URL} element={<ParentDashboard />} />
          <Route path={PARENT_DETAIL_URL} element={<ParentDetail />} />

          <Route path={STUDENTS_URL} element={<Students />} />
          <Route path={STUDENTS_DETAIL_URL} element={<StudentsDetail />} />
          <Route path={STUDENTS_EDIT_URL} element={<StudentsEdit />} />

          <Route path={SCHOOLS_URL} element={<Schools />} />
          <Route path={SCHOOLS_CREATE_URL} element={<SchoolsCreate />} />
          <Route path={SCHOOLS_DETAIL_URL} element={<SchoolsDetail />} />
          <Route path={SCHOOLS_EDIT_URL} element={<SchoolsEdit />} />

          <Route path={USERS_URL} element={<Users />} />
          <Route path={USERS_CREATE_URL} element={<UsersCreate />} />
          <Route path={USERS_DETAIL_URL} element={<UsersDetail />} />
          <Route path={USERS_EDIT_URL} element={<UsersEdit />} />
          <Route path={USERS_PASSWORD_URL} element={<UsersPassword />} />

          <Route path={ROUTES_URL} element={<BusRoutes />} />
          <Route path={ROUTES_DETAIL_URL} element={<BusRoutesDetail />} />
          <Route path={ROUTES_PLANNER_URL} element={<BusRoutesPlanner />} />
          <Route path={ROUTES_EDIT_URL} element={<BusRoutesEdit />} />
        </Routes>
      </div>
    );
  }
}

export default App;
