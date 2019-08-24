import React from "react";
import { Redirect } from "react-router-dom";


import { DefaultLayout } from "./layouts";

import Dashboard from "./pages/dashboard/dashboard";


export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: Dashboard
  },
];
