export const checkRequiredField = (key, value) => {
	const message = !value ? 'This field is required' : '';
	return { [key]: message };
};

export const checkAllRequiredFields = (fields, values) =>
	Object.entries(fields).reduce((acc, [key]) => {
		const message = !values[key] ? 'This field is required' : '';
		return { ...acc, [key]: message };
	}, {});
