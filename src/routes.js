import React from 'react';
import { Redirect } from 'react-router-dom';

import { DefaultLayout, Login as logins } from './layouts';

import Dashboard from './pages/dashboard/dashboard';
import Login from './pages/login/Login';
import { users, AddUser } from './pages/users/';
import { Post, PostAdd, PostDetails, EditPost } from './pages/posts/';
import { AddAdmin, Admin } from './pages/SubAdmin';
import Profile from './pages/Profile';
import Transaction from './pages/Transaction';
import Settings from './pages/Settings';
import { Coupons, AddCoupon, EditCoupon } from './pages/coupons';
const isLogin = () => {
	let login_datails = localStorage.getItem('userInfo');
	if (typeof login_datails === 'string') {
		login_datails = JSON.parse(localStorage.getItem('userInfo'));
	}
	if (typeof login_datails === 'object' && login_datails != null) {
		return <Redirect to='/dashboard' />;
	}
	return <Redirect to='/login' />;
};

export default [
	{
		path: '/',
		exact: true,
		layout: DefaultLayout,
		component: isLogin,
	},
	{
		path: '/dashboard',
		layout: DefaultLayout,
		component: Dashboard,
		auth: true,
	},
	{
		path: '/login',
		page: 'Login',
		layout: logins,
		component: Login,
		auth: false,
	},
	{
		path: '/users',
		page: 'users',
		layout: DefaultLayout,
		component: users,
		auth: true,
	},
	{
		path: '/add-user',
		page: 'add-users',
		layout: DefaultLayout,
		component: AddUser,
		auth: true,
	},
	{
		path: '/add-coupon',
		page: 'add-coupon',
		layout: DefaultLayout,
		component: AddCoupon,
		auth: true,
	},
	{
		path: '/edit-coupon',
		page: 'edit-coupon',
		layout: DefaultLayout,
		component: EditCoupon,
		auth: true,
	},
	{
		path: '/coupons',
		page: 'coupons',
		layout: DefaultLayout,
		component: Coupons,
		auth: true,
	},
	{
		path: '/posts',
		page: 'posts',
		layout: DefaultLayout,
		component: Post,
		auth: true,
	},
	{
		path: '/edit-post',
		page: 'edit-post',
		layout: DefaultLayout,
		component: EditPost,
		auth: true,
	},
	{
		path: '/add-post',
		page: 'add-post',
		layout: DefaultLayout,
		component: PostAdd,
		auth: true,
	},
	{
		path: '/post-details',
		page: 'Post Details',
		layout: DefaultLayout,
		component: PostDetails,
		auth: true,
	},
	{
		path: '/transaction',
		page: 'Trsansactin',
		layout: DefaultLayout,
		component: Transaction,
		auth: true,
	},
	{
		path: '/sub-admin',
		page: 'SubAdmin',
		layout: DefaultLayout,
		component: Admin,
		auth: true,
	},
	{
		path: '/add-admin',
		page: 'addAdmin',
		layout: DefaultLayout,
		component: AddAdmin,
		auth: true,
	},
	{
		path: '/Profile',
		page: 'Admin-Profile',
		layout: DefaultLayout,
		component: Profile,
		auth: true,
	},
	{
		path: '/settings',
		page: 'App-Setting',
		layout: DefaultLayout,
		component: Settings,
		auth: true,
	},
];
