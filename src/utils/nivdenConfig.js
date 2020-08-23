import nivedan from 'nivedan';

const details = () => {
	let login_datails;
	if (typeof localStorage.getItem('userInfo') === 'string') {
		login_datails = JSON.parse(localStorage.getItem('userInfo'));
	}
	if (typeof login_datails === 'object') {
		login_datails = JSON.parse(localStorage.getItem('userInfo'));
		return login_datails.token;
	}
	return false;
};

export const loginId = () => {
	let login_datails;
	if (typeof localStorage.getItem('userInfo') === 'string') {
		login_datails = JSON.parse(localStorage.getItem('userInfo'));
	}
	if (typeof login_datails === 'object') {
		login_datails = JSON.parse(localStorage.getItem('userInfo'));
		return login_datails.id;
	}
	return 0;
};

nivedan.defaultConfig({
	baseURL: `${window.location.origin}/admins`,
	errorExpand: true,
	errorMessageKey: 'error_message',
});

nivedan.middleware.request.use(
	function (config) {
		const newConfig = config;
		const token = details();
		if (token) {
			newConfig.headers = { token };
		}
		return newConfig;
	},
	function (error) {
		return Promise.reject(error);
	}
);

nivedan.middleware.response.use(
	(response) => response,
	(err) => {
		if (err.status === 401) {
			window.location.href = '/admin/login';
		}
		return Promise.reject(err);
	}
);

export default nivedan;
