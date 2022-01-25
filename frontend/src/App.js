// import HT_Logo from './static/img/HT_Logo.png';
import './App.css';
import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './static/custom.css';

import Login from "./templates/index";
import ParentDashboard from './templates/parent-dashboard';

import Students from "./templates/students";
import StudentsDetail from "./templates/students-detail";
import StudentsEdit from "./templates/students-edit";
// import StudentsDelete from "./templates/students-delete";

import Schools from "./templates/schools";
import SchoolsDetail from "./templates/schools-detail";
import SchoolsCreate from "./templates/schools-create";
import SchoolsEdit from "./templates/schools-edit";
// import SchoolsDelete from "./templates/schools-delete";

import Users from "./templates/users";
import UsersDetail from "./templates/users-detail";
import UsersCreate from "./templates/users-create";
import UsersEdit from "./templates/users-edit";
// import UsersDelete from "./templates/users-delete";

import BusRoutes from "./templates/routes";
import BusRoutesDetail from "./templates/routes-detail";
import BusRoutesPlanner from "./templates/routes-planner";
import BusRoutesEdit from "./templates/routes-edit";
// import BusRoutesDelete from "./templates/routes-delete";

class App extends Component {
  render() {
    return (
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ParentDashboard />} />

          <Route path="/students" element={<Students />} />
          <Route path="/students-detail" element={<StudentsDetail />} />
          <Route path="/students-edit" element={<StudentsEdit />} />

          <Route path="/schools" element={<Schools />} />
          <Route path="/schools/create" element={<SchoolsCreate />} />
          <Route path="/schools-detail" element={<SchoolsDetail />} />
          <Route path="/schools-edit" element={<SchoolsEdit />} />

          <Route path="/users" element={<Users />} />
          <Route path="/users/create" element={<UsersCreate />} />
          <Route path="/users-detail" element={<UsersDetail />} />
          <Route path="/users-edit" element={<UsersEdit />} />

          <Route path="/routes" element={<BusRoutes />} />
          <Route path="/routes-detail" element={<BusRoutesDetail />} />
          <Route path="/schools/routes-planner" element={<BusRoutesPlanner />} />
          <Route path="/routes-edit" element={<BusRoutesEdit />} />
        </Routes>
      </div>
    );
  }
}

export default App;
