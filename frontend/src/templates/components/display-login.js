import React from "react";
import Login from "../components/login";

const displayLogin = props => {
  let { hasToken } = props;

  if (!hasToken) {
    return <Login/>;
  }
};

export default displayLogin;