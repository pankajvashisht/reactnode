require('dotenv').config();

const path = require('path');
const config = {
	port: process.env.port || 4000,
	root_path: path.resolve(__dirname).replace('config', 'public'),
	AppName: 'Radio',
	GOOGLE_KEY:
		'AAAAcGgF5QQ:APA91bEBD28ByjY_x53Ut1V2ZXvfBai_t2s6pJEoPEjUEYfwtG-IpM0Al5J65lU-Ifvmol0-5nCsRWHvCHYmnPZ9iJRbYqOdzK1-wgXjn1U2TdmexOuB6VMK7pt0TIpJhPgjwbjJtIFl',
};

module.exports = config;
