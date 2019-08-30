import React from "react";
import { Redirect } from "react-router-dom";


import { DefaultLayout, Login as logins } from "./layouts";

import Dashboard from "./pages/dashboard/dashboard";
import Login from "./pages/login/Login";
import { users, AddUser } from "./pages/users/";
import { Post, PostAdd } from "./pages/posts/";


const isLogin = () => {
  let login_datails = localStorage.getItem('userInfo');
  console.log(typeof login_datails);
  if (typeof login_datails === 'string') {
    login_datails = JSON.parse(localStorage.getItem('userInfo'));
  }
  if (typeof login_datails === 'object' && login_datails!=null) {
    return <Redirect to="/dashboard" />
  }
  return <Redirect to="/login" />
}

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: isLogin
  },
  {
    path: "/dashboard",
    exact: true,
    layout: DefaultLayout,
    component: Dashboard
  },
  {
    path: "/login",
    page: 'Login',
    layout: logins,
    component: Login
  },
  {
    path: "/users",
    page: 'users',
    layout: DefaultLayout,
    component: users
  },
  {
    path: "/add-user",
    page: 'add-users',
    layout: DefaultLayout,
    component: AddUser
  },
  {
    path: "/posts",
    page: 'posts',
    layout: DefaultLayout,
    component: Post
  },
  {
    path: "/add-post",
    page: 'add-post',
    layout: DefaultLayout,
    component: PostAdd
  }
];
