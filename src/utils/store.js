export const getLoginInfo = () => {
	let login_datails = localStorage.getItem('userInfo');
	if (typeof login_datails === 'string') {
		login_datails = JSON.parse(localStorage.getItem('userInfo'));
	}
	if (typeof login_datails === 'object' && login_datails != null) {
		return login_datails;
	}
	return false;
};
