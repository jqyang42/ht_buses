// import HT_Logo from './static/img/HT_Logo.png';
import './App.css';
import React, { Component } from "react";
import {Routes, Route} from "react-router-dom";
// import './static/bootstrap/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './static/custom.css';

import Login from "./templates/index";

import Students from "./templates/students";
// import Students_Detail from "./templates/students_detail";
// import Students_Edit from "./templates/students_edit";
// import Students_Delete from "./templates/students_delete";

import Schools from "./templates/schools";
// import Schools_Detail from "./templates/schools_detail";
// import Schools_Create from "./templates/schools_create";
// import Schools_Edit from "./templates/schools_edit";
// import Schools_Delete from "./templates/schools_delete";

import Users from "./templates/users";
// import Users_Detail from "./templates/users_detail";
// import Users_Create from "./templates/users_create";
// import Users_Edit from "./templates/users_edit";
// import Users_Delete from "./templates/users_delete";

import Bus_Routes from "./templates/routes";
// import Bus_Routes_Detail from "./templates/routes_detail";
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
          {/* <Route path="/students/:id" element={<Students_Detail />} />
          <Route path="/students/:id/edit" element={<Students_Edit />} />
          <Route path="/students/:id/delete" element={<Students_Delete />} /> */}

					<Route path="/schools" element={<Schools />} />
          {/* <Route path="/schools/create" element={<Schools_Create />} />
          <Route path="/schools/:id" element={<Schools_Detail />} />
          <Route path="/schools/:id/edit" element={<Schools_Edit />} />
          <Route path="/schools/:id/delete" element={<Schools_Delete />} /> */}

          <Route path="/users" element={<Users />} />
          {/* <Route path="/users/create" element={<Users_Create />} />
          <Route path="/users/:id" element={<Users_Detail />} />
          <Route path="/users/:id/edit" element={<Users_Edit />} />
          <Route path="/users/:id/delete" element={<Users_Delete />} /> */}

          <Route path="/routes" element={<Bus_Routes />} />
					{/* <Route path="/routes/:id" element={<Bus_Routes_Detail />} />
          <Route path="/schools/:id/routes_planner" element={<Bus_Routes_Planner />} />
          <Route path="/routes/:id/edit" element={<Bus_Routes_Edit />} />
          <Route path="/routes/:id/delete" element={<Bus_Routes_Delete />} /> */}
				</Routes>
			</div>
		);
	}
}

export default App;
