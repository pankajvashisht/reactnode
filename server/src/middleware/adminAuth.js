const Db = require('../../libary/sqlBulider');
const app = require('../../libary/CommanMethod');
const DB = new Db();

const AdminAuth = async (req, res, next) => {
	try {
		if (req.path === '/login') {
			next();
			return;
		}
		if (!req.headers.hasOwnProperty('token')) {
			throw { code: 400, message: 'token key is required' };
		}
		let user_details = await DB.find('admins', 'first', {
			conditions: {
				token: req.headers.token,
			},
		});
		if (user_details) {
			// if (app.UserToken(user_details.id, req) !== req.query.token) {
			//   throw { code: 401, message: 'Invaild Authorization' };
			// }
			req.admin_id = user_details.id;
			req.auth = user_details;
			next();
			return;
		}
		throw { code: 401, message: 'Invaild Authorization' };
	} catch (err) {
		app.error(res, err);
	}
};

module.exports = AdminAuth;
