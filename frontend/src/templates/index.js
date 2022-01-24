import React, { Component } from "react";
import HT_Logo from '../static/img/HT_Logo.png';

class Login extends Component {
	render() {
		return (
            <main>
                <body className="overflow-hidden">
                    <div className="container-fluid mx-0 px-0">
                        <div className="row flex-nowrap">

                            <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                                <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white min-vh-100">
                                    <a href="/" className="d-flex align-items-center my-0 mx-2 px-4 pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                        <img src={HT_Logo} className="img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation"></img>
                                    </a>
                                </div>
                            </div>

                            <div className="col mx-0 px-0 bg-gray w-100">
                                <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-2 bg-white mw-100 w-100 shadow-sm">
                                    <div className="mx-2 py-2">
                                        <h5>Hypothetical Transportation Bus Management System</h5>
                                    </div>
                                </div>
                                <div className="container mt-4 mx-2">
                                    <div className="row">
                                        <div className="col-6">
                                            <h2 className="pb-4">Log In</h2>
                                            <form action= "" method= "post">
                                                <div className="form-group pb-3">
                                                    <label for="exampleInputEmail1" className="pb-2">Email</label>
                                                    <input type="email" className="form-control pb-2" name= "email" id="exampleInputEmail1" aria-describedby="emailHelp"
                                                        placeholder="Enter email"></input>
                                                    <small id="emailHelp" className="form-text text-muted pb-2">We'll never share your email with anyone else.</small>
                                                </div>
                                                <div className="form-group pb-3">
                                                    <label for="exampleInputPassword1" className="pb-2">Password</label>
                                                    <input type="password" className="form-control pb-2" name="password" id="exampleInputPassword1" placeholder="Password"></input>
                                                </div>
                                                <div className="form-group form-check pb-4">
                                                    <input type="checkbox" className="form-check-input pb-2" id="exampleCheck1"></input>
                                                    <label className="form-check-label pb-2" for="exampleCheck1">Remember me</label>
                                                </div>
                                                <button type="submit" className="btn btn-primary">Log In</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </main>
		);
	}
}

export default Login;