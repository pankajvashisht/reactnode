require('dotenv').config();
const database = {
	default: process.env.DATABASE || 'mysql',
	mysql: {
		host: 'localhost',
		user: 'user',
		password: 'root@admin',
		database: 'tiger',
		connectionLimit: 50,
	},
};

module.exports = database;
