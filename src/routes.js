import React from "react";
import { Redirect } from "react-router-dom";

import { DefaultLayout, Login as logins } from "./layouts";

import Dashboard from "./pages/dashboard/dashboard";
import Login from "./pages/login/Login";

export default [
  {
    path: "/",
    exact: true,
    page: 'Dashboard',
    layout: DefaultLayout,
    component: Dashboard
  },
  {
    path: "/login",
    page: 'Login',
    layout: logins,
    component: Login
  },
];
