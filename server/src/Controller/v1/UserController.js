const ApiController = require('./ApiController');
const app = require('../../../libary/CommanMethod');
const Db = require('../../../libary/sqlBulider');
const DB = new Db();
let apis = new ApiController();

class UserController extends ApiController {
	constructor() {
		super();
		this.addUser = this.addUser.bind(this);
	}
	async addUser(req, res) {
		const required = {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			phone: req.body.phone,
			checkexist: 1,
		};
		const non_required = {
			device_type: req.body.device_type,
			device_token: req.body.device_token,
			dob: req.body.dob,
			authorization_key: app.createToken(),
			otp: app.randomNumber(),
		};
		try {
			const request_data = await apis.vaildation(required, non_required);
			if (req.files && req.files.profile) {
				request_data.profile = await app.upload_pic_with_await(
					req.files.profile
				);
			}
			const insert_id = await DB.save('users', request_data);
			const { phone, otp } = request_data;
			request_data.id = insert_id;
			setTimeout(() => {
				this.sendOTP(phone, otp);
			}, 100);
			app.success(res, {
				message: 'User signup successfully',
				data: {
					authorization_key: request_data.authorization_key,
				},
			});
		} catch (err) {
			app.error(res, err);
		}
	}
	async sendOTP(to, otp) {
		const message = `${otp} is your one time password to verify account on Tiger2LL. It is vaild for 30 minutes.Do not share your OTP with anyone`;
		app.sendSMS({ to, message });
	}
	async verifyOtp(req, res) {
		try {
			let required = {
				otp: req.body.otp,
			};
			let non_required = {};

			let request_data = await super.vaildation(required, non_required);
			if (request_data.otp != req.body.userInfo.otp) {
				throw ' Invaild Otp ';
			}
			req.body.userInfo.status = 1;
			await DB.save('users', req.body.userInfo);
			const usersinfo = await super.userDetails(req.body.userInfo.id);
			if (usersinfo.profile.length > 0) {
				usersinfo.profile = app.ImageUrl(usersinfo.profile);
			}
			app.success(res, {
				message: ' Otp verify Successfully',
				data: usersinfo,
			});
		} catch (err) {
			app.error(res, err);
		}
	}

	async forgotPassword(req, res) {
		try {
			const required = {
				email: req.body.email,
			};
			const requestData = await super.vaildation(required, {});
			const userInfo = await DB.find('users', 'first', {
				conditions: {
					email: requestData.email,
				},
				fields: ['id', 'email', 'name', 'forgot_password_hash'],
			});
			if (!userInfo) throw 'Email not found';
			userInfo.forgot_password_hash = app.createToken();
			await DB.save('users', userInfo);
			const mail = {
				to: requestData.email,
				subject: 'Forgot Password',
				template: 'forgot_password',
				data: {
					name: userInfo.name,
					url: `${global.appURL}users/change_password/${userInfo.forgot_password_hash}/0`,
				},
			};
			await app.send_mail(mail);
			return app.success(res, {
				message: 'Email sent',
				data: [],
			});
		} catch (err) {
			app.error(res, err);
		}
	}

	async changePassword(req, res) {
		let required = {
			old_password: req.body.old_password,
			new_password: req.body.new_password,
		};
		try {
			let request_data = await super.vaildation(required, {});
			const loginInfo = req.body.userInfo;
			if (loginInfo.password !== request_data.old_password) {
				throw 'Old password is wrong';
			}
			loginInfo.password = request_data.new_password;
			await DB.save('users', loginInfo);
			return app.success(res, {
				message: 'Password change successfully',
				data: [],
			});
		} catch (err) {
			app.error(res, err);
		}
	}

	async loginUser(req, res) {
		try {
			let required = {
				email: req.body.email,
				password: req.body.password,
			};
			let non_required = {
				device_type: req.body.device_type,
				device_token: req.body.device_token,
				authorization_key: app.createToken(),
			};

			let request_data = await super.vaildation(required, non_required);
			let login_details = await DB.find('users', 'first', {
				conditions: {
					email: request_data.email,
				},
				fields: [
					'id',
					'name',
					'password',
					'email',
					'authorization_key',
					'profile',
					'phone',
					'status',
					'dob',
					'(select count(id) from users_posts where user_id=users.id) as total_purchase',
				],
			});
			if (login_details) {
				if (request_data.password != login_details.password)
					throw 'Wrong Email or password';
				delete login_details.password;
				await DB.save('users', {
					id: login_details.id,
					device_type: request_data.device_type,
					device_token: request_data.device_token,
					authorization_key: request_data.authorization_key,
				});
				login_details.authorization_key = request_data.authorization_key;
				if (login_details.profile.length > 0) {
					login_details.profile = app.ImageUrl(login_details.profile);
				}
				return app.success(res, {
					message: 'User login successfully',
					data: login_details,
				});
			}
			throw 'Wrong Email or password';
		} catch (err) {
			app.error(res, err);
		}
	}

	async appInfo(req, res) {
		try {
			let app_info = await DB.find('app_information', 'all');
			app.success(res, {
				message: 'App Information',
				data: app_info,
			});
		} catch (err) {
			app.error(res, err);
		}
	}
	async updateProfile(req, res) {
		try {
			let required = {
				id: req.body.user_id,
			};
			let non_required = {
				gender: req.body.gender,
				interest: req.body.interest,
				dob: req.body.dob,
				name: req.body.name,
			};
			let request_data = await super.vaildation(required, non_required);
			if (req.files && req.files.profile) {
				request_data.profile = await app.upload_pic_with_await(
					req.files.profile
				);
			}
			await DB.save('users', request_data);
			const usersinfo = await super.userDetails(request_data.id);
			if (usersinfo.profile.length > 0) {
				usersinfo.profile = app.ImageUrl(usersinfo.profile);
			}
			return app.success(res, {
				message: 'all users list',
				data: usersinfo,
			});
		} catch (err) {
			app.error(res, err);
		}
	}

	async logout(req, res) {
		try {
			let required = {
				id: req.body.user_id,
			};
			let request_data = await super.vaildation(required, {});
			request_data.authorization_key = '';
			await DB.save('users', request_data);
			return app.success(res, {
				message: 'logout user successfully',
				data: [],
			});
		} catch (err) {
			app.error(res, err);
		}
	}
}

module.exports = UserController;
