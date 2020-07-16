export const checkRequiredField = (key, value) => {
	const message = !value ? 'This field is required' : '';
	return { [key]: message };
};

export const checkAllRequiredFields = (fields, values) =>
	Object.entries(fields).reduce((acc, [key]) => {
		const message = !values[key] ? 'This field is required' : '';
		return { ...acc, [key]: message };
	}, {});

export const dateFormate = () => {
	var dtToday = new Date();
	var month = dtToday.getMonth() + 1;
	var day = dtToday.getDate();
	var year = dtToday.getFullYear();
	if (month < 10) month = '0' + month.toString();
	if (day < 10) day = '0' + day.toString();
	return `${year}-${month}-${day}`;
};

export const convertDate = (date) => {
	date = isNaN(date) ? date : date * 1000;
	var dtToday = new Date(date);
	var month = dtToday.getMonth() + 1;
	var day = dtToday.getDate();
	var year = dtToday.getFullYear();
	if (month < 10) month = '0' + month.toString();
	if (day < 10) day = '0' + day.toString();
	return `${year}-${month}-${day}`;
};
export const convertTime = (date) => {
	return Math.round(new Date(date).getTime() / 1000, 0);
};
