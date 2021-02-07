const Db = require('../../../libary/sqlBulider');
const app = require('../../../libary/CommanMethod');
let DB = new Db();

class adminController {
	constructor() {
		this.limit = 20;
		this.offset = 1;
		this.login = this.login.bind(this);
		this.islogin = this.islogin.bind(this);
		this.allUser = this.allUser.bind(this);
		this.allPost = this.allPost.bind(this);
		this.transaction = this.transaction.bind(this);
		this.allAdmins = this.allAdmins.bind(this);
	}
	async login(req, res) {
		const { body } = req;
		try {
			let login_details = await DB.find('admins', 'first', {
				conditions: {
					email: body.email,
				},
			});
			if (login_details) {
				if (app.createHash(body.password) != login_details.password)
					throw 'Wrong Email or password';
				delete login_details.password;
				let token = await app.UserToken(login_details.id, req);
				await DB.save('admins', {
					id: login_details.id,
					token: token,
				});
				login_details.token = token;
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
	async allUser(req) {
		let offset = req.params.offset !== undefined ? req.params.offset : 1;
		let limit = req.params.limit !== undefined ? req.params.limit : 20;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (req.query.q.length > 0 && req.query.q !== 'undefined') {
			conditions +=
				" where name like '%" +
				req.query.q +
				"%' or email like '%" +
				req.query.q +
				"%'";
		}
		let query =
			'select * from users ' +
			conditions +
			' order by id desc limit ' +
			offset +
			' , ' +
			limit;
		return this.addUrl(await DB.first(query), 'profile');
	}

	async getReview(req) {
		let offset = req.params.offset !== undefined ? req.params.offset : 1;
		let limit = req.params.limit !== undefined ? req.params.limit : 20;
		offset = (offset - 1) * limit;
		let conditions = 'where post_id = ' + req.params.post_id;
		let query =
			'select * from post_comments ' +
			conditions +
			' order by id desc limit ' +
			offset +
			' , ' +
			limit;
		return await DB.first(query);
	}

	async allPost(req) {
		let offset = req.params.offset !== undefined ? req.params.offset : 1;
		let limit = req.params.limit !== undefined ? req.params.limit : 20;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (req.auth.admin_role !== 0) {
			conditions = ' where posts.user_id = ' + req.auth.id;
		}
		if (req.query.q.length > 0) {
			if (conditions.length > 0) {
				conditions +=
					" and title like '%" +
					req.query.q +
					"%' or description like '%" +
					req.query.q +
					"%'";
			} else {
				conditions += `where title like '%${req.query.q}%' or description like '% ${req.query.q}%'`;
			}
		}
		let query =
			'select posts.*,admins.name,admins.email,admins.profile,admins.admin_role from posts left join admins on (posts.user_id = admins.id)' +
			conditions +
			' order by posts.id desc limit ' +
			offset +
			' , ' +
			limit;
		return this.addUrl(await DB.first(query), [
			'url',
			'audio',
			'cover_pic',
			'audio_sample',
			'profile',
		]);
	}

	addUrl(data, key) {
		if (data.length === 0) {
			return [];
		}
		data.forEach((element, keys) => {
			if (!Array.isArray(key)) {
				data[keys][key] = app.ImageUrl(data[keys][key]);
			} else {
				for (let names of key) {
					if (data[keys][names].length > 0) {
						data[keys][names] = app.ImageUrl(data[keys][names]);
					}
				}
			}
		});
		return data;
	}

	async addPost(req) {
		const { body } = req;
		if (req.auth.admin_role === 1) {
			delete body.user_id;
		}
		if (body.id) {
			sendPush({
				id: body.id,
				price: body.price,
				sale_price: body.sale_price,
			});
		}
		if (body.released_date) {
			body.released_date = app.convertTime(body.released_date);
		}
		delete body.url;
		delete body.cover_pic;
		delete body.audio_sample;
		delete body.audio;
		if (req.files && req.files.url) {
			body.url = await app.upload_pic_with_await(req.files.url);
			delete req.files.url.data;
			body.metadata = JSON.stringify(req.files.url);
		}
		if (req.files && req.files.audio) {
			body.audio = await app.upload_pic_with_await(req.files.audio);
			body.metadata = JSON.stringify(req.files.url);
		}
		if (req.files && req.files.cover_pic) {
			body.cover_pic = await app.upload_pic_with_await(req.files.cover_pic);
		}
		if (req.files && req.files.sample_audio) {
			body.audio_sample = await app.upload_pic_with_await(
				req.files.sample_audio
			);
		}

		return await DB.save('posts', body);
	}
	async addUser(req) {
		const { body } = req;
		delete body.profile;
		try {
			if (req.files && req.files.profile) {
				body.profile = await app.upload_pic_with_await(req.files.profile);
			}
			return await DB.save('users', body);
		} catch (err) {
			throw new Error(JSON.stringify(err));
		}
	}

	async addAdmin(req) {
		const { body } = req;
		delete body.profile;
		body.password = app.createHash(body.password);
		body.admin_id = req.admin_id;
		const users = await DB.first(
			"select email from admins where email = '" + body.email + "'"
		);
		if (users.length > 0) {
			throw 'Email Already exits Please choice different';
		}
		if (req.auth.admin_role === 1) {
			body.admin_role = 2;
		}
		if (req.files && req.files.profile) {
			body.profile = await app.upload_pic_with_await(req.files.profile);
		}
		return await DB.save('admins', body);
	}

	async appInfo() {
		return await DB.first(`select * from app_information`);
	}

	async updateAppInfo(Request) {
		const { body } = Request;
		return await DB.save('app_information', body);
	}

	async allAdmins(req) {
		let offset = req.params.offset !== undefined ? req.params.offset : 1;
		let limit = req.params.limit !== undefined ? req.params.limit : 20;
		offset = (offset - 1) * limit;
		const { admin_role } = req.auth;
		let conditions = `where admin_role != 0`;
		if (admin_role === 1) {
			conditions = `where admin_role = 2 and admin_id=${req.admin_id}`;
		}
		if (req.query.q.length > 0 && req.query.q !== 'undefined') {
			conditions += ` and  name like '%${req.query.q}%' or email like '%${req.query.q}%'`;
		}
		const query = `select * from admins ${conditions} order by id desc limit ${offset}, ${limit}`;
		return this.addUrl(await DB.first(query), 'profile');
	}

	async updateData(req, res, next) {
		const { body } = req;
		try {
			if (body.id === undefined) {
				throw 'id is missing';
			}
			if (req.files && req.files.url) {
				body.url = await app.upload_pic_with_await(req.files.url);
				delete req.files.url.data;
				body.metadata = JSON.stringify(req.files.url);
			}
			if (req.files && req.files.profile) {
				body.profile = await app.upload_pic_with_await(req.files.profile);
			}
			return await DB.save(body.table, body);
		} catch (err) {
			next(err);
		}
	}
	async deleteData(req, res, next) {
		const { body } = req;
		try {
			if (body.id === undefined) {
				throw 'id is missing';
			}
			return await DB.first(
				'delete from ' + body.table + ' where id =' + body.id
			);
		} catch (err) {
			next(err);
		}
	}

	islogin(req, res) {
		return true;
	}

	async addCoupon(Request) {
		const { body } = Request;
		return await DB.save('coupons', body);
	}

	async forgetPassword(Request) {
		const { email = '' } = Request.body;
		if (!email) throw 'Email is required';
		const userInfo = await DB.find('admins', 'first', {
			conditions: {
				email,
			},
			fields: ['id', 'email', 'name', 'forgot_password_hash'],
		});
		if (!userInfo) throw 'Email not found';
		userInfo.forgot_password_hash = app.createToken();
		await DB.save('admins', userInfo);
		const mail = {
			to: email,
			subject: 'Forgot Password',
			template: 'forgot_password',
			data: {
				name: userInfo.name,
				url: `${global.appURL}users/change_password/${userInfo.forgot_password_hash}/1`,
			},
		};
		await app.send_mail(mail);
		return {
			message: 'Email sent',
			data: [],
		};
	}

	async updateAdmin(Request) {
		const { body } = Request;
		delete body.profile;
		if (body.password && body.password !== 'undefined') {
			body.password = app.createHash(body.password);
		} else {
			delete body.password;
		}
		const users = await DB.first(
			`select email from admins where email = '${body.email}' and id != ${body.id}`
		);
		if (users.length > 0) {
			throw 'Email Already exits Please choice different';
		}
		if (Request.files && Request.files.profile) {
			body.profile = await app.upload_pic_with_await(Request.files.profile);
		}
		await DB.save('admins', body);
		const login_details = await DB.find('admins', 'first', {
			conditions: {
				id: body.id,
			},
		});
		if (login_details.profile.length > 0) {
			login_details.profile = app.ImageUrl(login_details.profile);
		}
		return login_details;
	}

	async getCoupons(Request) {
		let { offset = 1, limit = 100 } = Request.params;
		const { q = '' } = Request.query;
		let conditions = ``;
		if (q !== 'undefined' && q.length > 0) {
			conditions = `where name like  '%${q}%' or discount like  '%${q}%'`;
		}
		offset = (offset - 1) * limit;
		const query = `select * from coupons ${conditions} order by id desc limit ${offset}, ${limit}`;
		return await DB.first(query);
	}

	async dashboard(req) {
		const totals = {
			posts: 0,
		};

		let conditions = ' where user_id = ' + req.auth.id;
		if (req.auth.admin_role === 0) {
			conditions = '';
			totals.users = await DB.first('select count(*) as total from users');
			totals.totalAmount = await DB.first(
				'select IFNull(sum(amount),0) as total from users_posts'
			);
			totals.users = totals.users[0].total;
			totals.totalAmount = totals.totalAmount[0].total;
		}
		totals.posts = await DB.first(
			'select count(*) as total from posts conditions' + conditions
		);
		let condition = `where admin_role != 0`;
		if (req.auth.admin_role === 1) {
			condition = `where admin_role = 2 and admin_id = ${req.admin_id}`;
		}
		const subAdmins = await DB.first(
			`select count(id) as total from admins ${condition}`
		);
		totals.posts = totals.posts[0].total;
		totals.subAdmins = subAdmins[0].total;
		return totals;
	}
	async transaction(req) {
		let offset = req.params.offset !== undefined ? req.params.offset : 1;
		let limit = req.params.limit !== undefined ? req.params.limit : 300;
		const { formDate = 0, toDate = 0 } = req.query;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (req.auth.admin_role !== 0) {
			conditions = `where posts.user_id =  ${req.auth.id}`;
		}
		if (formDate !== 0 && toDate !== 0) {
			conditions = `where users_posts.created >=  ${formDate} and users_posts.created <=  ${toDate} `;
			limit = '1000';
		}
		if (req.query.q.length > 0) {
			const query = req.query.q;
			conditions += ` ${
				conditions.length > 0 ? 'and' : 'where'
			}  posts.title like '%${query}%' or posts.description like '%${query}%' or users.name like '%${query}%' or users.email like '%${query} 
				%'`;
		}
		let query =
			'select posts.*, coupons.name as couponName, coupons.discount as couponDiscount,  users_posts.*, users_posts.created as purchaseDate, users.name as username, users.email as email, users.profile as profile';
		query += ' from users_posts';
		query += ' join posts on (posts.id = users_posts.post_id)';
		query += ' left join coupons on (coupons.id = users_posts.coupon_id)';
		query +=
			' left join users on (users.id = users_posts.user_id)' + conditions;
		query += ' order by users_posts.id desc limit ' + offset + ' ,' + limit;
		return this.addUrl(await DB.first(query), [
			'profile',
			'url',
			'cover_pic',
			'audio_sample',
			'audio',
		]);
	}
}

module.exports = adminController;
const sendPush = async ({ id, price, sale_price }) => {
	const post = await DB.find('posts', 'first', {
		conditions: {
			id,
		},
	});
	if (
		post.price > parseFloat(price) ||
		post.sale_price > parseFloat(sale_price)
	) {
		const allUsers = await DB.first(
			`select users.device_token, users.device_type from favourites join users on (favourites.user_id = users.id) where post_id = ${id} and device_token != ''`
		);
		allUsers.forEach((user) => {
			if (post.price > parseFloat(price)) {
				app.send_push({
					token: user.device_token,
					message: `Author has changed ${
						post.post_type === 3 ? 'Audio Book' : 'E-book'
					} price, New price is $${price}`,
					data: { post_id: id },
				});
			}
			if (post.sale_price > parseFloat(sale_price)) {
				app.send_push({
					token: user.device_token,
					message: `Author has changed ${
						post.post_type === 3 ? 'Audio Book' : 'E-book'
					} sale price, New sale price is $${sale_price}`,
					data: { post_id: id },
				});
			}
		});
	}
};
