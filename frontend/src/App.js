// import HT_Logo from './static/img/HT_Logo.png';
import './App.css';
import React, { Component } from "react";
import {Routes, Route} from "react-router-dom";
// import './static/bootstrap/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './static/custom.css';

import Login from "./templates/index";

import Students from "./templates/students";
import StudentsDetail from "./templates/students_detail";
// import Students_Edit from "./templates/students_edit";
// import Students_Delete from "./templates/students_delete";

import Schools from "./templates/schools";
import SchoolsDetail from "./templates/schools_detail";
import SchoolsCreate from "./templates/schools_create";
// import Schools_Edit from "./templates/schools_edit";
// import Schools_Delete from "./templates/schools_delete";

import Users from "./templates/users";
import UsersDetail from "./templates/users_detail";
import UsersCreate from "./templates/users_create";
// import Users_Edit from "./templates/users_edit";
// import Users_Delete from "./templates/users_delete";

import BusRoutes from "./templates/routes";
import BusRoutesDetail from "./templates/routes_detail";
// import Bus_Routes_Planner from "./templates/routes_planner";
// import Bus_Routes_Edit from "./templates/routes_edit";
// import Bus_Routes_Delete from "./templates/routes_delete";

class App extends Component {
  render() {
		return (
			<div>
				<Routes>
					<Route path="/" element={<Login />} />

					<Route path="/students" element={<Students />} />
          <Route path="/students_detail" element={<StudentsDetail />} />
          {/* <Route path="/students/:id/edit" element={<StudentsEdit />} /> */}
          {/* <Route path="/students/:id/delete" element={<StudentsDelete />} /> */}

					<Route path="/schools" element={<Schools />} />
          <Route path="/schools/create" element={<SchoolsCreate />} />
          <Route path="/schools_detail" element={<SchoolsDetail />} />
          {/* <Route path="/schools/:id/edit" element={<SchoolsEdit />} /> */}
          {/* <Route path="/schools/:id/delete" element={<SchoolsDelete />} /> */}

          <Route path="/users" element={<Users />} />
          <Route path="/users/create" element={<UsersCreate />} />
          <Route path="/users_detail" element={<UsersDetail />} />
          {/* <Route path="/users/:id/edit" element={<UsersEdit />} /> */}
          {/* <Route path="/users/:id/delete" element={<UsersDelete />} /> */}

          <Route path="/routes" element={<BusRoutes />} />
					<Route path="/routes_detail" element={<BusRoutesDetail />} />
          {/* <Route path="/schools/:id/routes_planner" element={<BusRoutesPlanner />} /> */}
          {/* <Route path="/routes/:id/edit" element={<BusRoutesEdit />} /> */}
          {/* <Route path="/routes/:id/delete" element={<BusRoutesDelete />} /> */}
				</Routes>
			</div>
		);
	}
}

export default App;
