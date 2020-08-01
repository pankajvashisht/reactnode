import axios, { loginId } from '../utils/nivdenConfig';
export const Adminlogin = ({ email, password }) => {
	return axios.post(`/login`, {
		email,
		password,
	});
};

export const addUser = (userForm) => {
	let form = new FormData();
	form.append('name', userForm.name);
	form.append('password', userForm.password);
	form.append('email', userForm.email);
	form.append('profile', userForm.profile);
	return axios.post(`/users`, form);
};

export const addAdmin = (userForm) => {
	let form = new FormData();
	form.append('name', userForm.name);
	form.append('password', userForm.password);
	form.append('email', userForm.email);
	form.append('profile', userForm.profile);
	form.append('admin_role', userForm.admin_type);
	return axios.post(`/admins`, form);
};
export const getUser = (page = 1, query = '') => {
	return axios.get(`/users?q=${query}`);
};
export const getAdmin = (page = 1, query = '') => {
	return axios.get(`/admins?q=${query}`);
};
export const getPost = (page = 1, query = '') => {
	return axios.get(`/posts?q=${query}`);
};
export const dashBaord = () => {
	return axios.get(`/dashboard`);
};

export const updateUser = (data) => {
	return axios.put(`/users`, {
		table: data.table,
		id: data.id,
		status: data.status,
	});
};

export const deleteUser = (data) => {
	return axios.delete(
		`/users`,
		{ data },
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}
	);
};

export const checkAuth = () => {
	return axios.get(`/checkAuth`);
};

export const transaction = (page = 1, query = '') => {
	return axios.get(`/transaction?q=${query}`);
};

export const review = (post_id, page = 1) => {
	return axios.get(`/review/${post_id}`);
};

export const updateInfo = (data) => {
	return axios.put(`/app-info`, data);
};
export const AppInfo = () => {
	return axios.get(`/app-info`);
};
export const addCoupons = (data) => {
	return axios.post(`/coupon`, data);
};
export const getCoupons = (query) => {
	return axios.get(`/coupon?q=${query}`);
};
export const addPost = (data) => {
	var form = new FormData();
	form.append('title', data.name || data.title);
	form.append('url', data.url);
	form.append('post_type', data.posttype);
	form.append('price', data.price);
	form.append('description', data.description);
	form.append('cover_pic', data.cover_pic);
	form.append('fiction', data.fiction);
	form.append('sale_price', data.sale_price);
	form.append('user_id', loginId());
	form.append('author_name', data.author_name);
	form.append('soical_media_name', data.soical_media_name);
	form.append('rsb', data.rsb);
	form.append('released_date', data.released_date);
	form.append('genre', data.genre);
	form.append('ismb', data.ismb);
	form.append('rating', data.rating);
	form.append('peek', data.peek);
	form.append('lbr', data.lbr);
	form.append('pages', data.pages);
	if (data.hasOwnProperty('id')) {
		form.append('id', data.id);
	}
	if (data.hasOwnProperty('audio')) {
		form.append('audio', data.audio);
	}
	if (data.hasOwnProperty('sample_audio')) {
		form.append('sample_audio', data.sample_audio);
	}
	return axios.post(`/posts`, form);
};

export const EditPostAPI = (data) => {
	var form = new FormData();
	form.append('title', data.title);
	form.append('url', data.url);
	form.append('post_type', data.post_type);
	form.append('price', data.price);
	form.append('description', data.description);
	form.append('cover_pic', data.cover_pic);
	form.append('user_id', loginId());
	form.append('author_name', data.author_name);
	form.append('soical_media_name', data.soical_media_name);
	form.append('genre', data.genre);
	form.append('ismb', data.ismb);
	form.append('rating', data.rating);
	form.append('fiction', data.fiction);
	form.append('sale_price', data.sale_price);
	form.append('rsb', data.rsb);
	form.append('peek', data.peek);
	form.append('lbr', data.lbr);
	form.append('pages', data.pages);
	if (isNaN(data.released_date))
		form.append('released_date', data.released_date);
	if (data.hasOwnProperty('id')) {
		form.append('id', data.id);
	}
	if (data.hasOwnProperty('audio')) {
		form.append('audio', data.audio);
	}
	if (data.hasOwnProperty('sample_audio')) {
		form.append('sample_audio', data.sample_audio);
	}
	return axios.post(`/posts`, form);
};
