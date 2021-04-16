const ApiController = require('./ApiController');
const app = require('../../../libary/CommanMethod');
const Db = require('../../../libary/sqlBulider');
const resize = require('../../../config/resize');
const config = require('../../../config/config');
let apis = new ApiController();
let DB = new Db();
module.exports = {
	getPost: async (req, res) => {
		const required = {
			user_id: req.body.user_id,
			offset: req.params.offset,
			post_type: req.query.post_type || 'nothing',
		};
		try {
			const request_data = await apis.vaildation(required, {});
			const { search = '', limit = 20 } = req.query;
			let offset = (request_data.offset - 1) * limit;
			let query = 'select posts.*, ';
			query +=
				'(select count(*) from users_posts where user_id = ' +
				request_data.user_id +
				' and post_id = posts.id) as is_buy,IFNULL((select avg(rating) from post_comments where post_id = posts.id),0) as post_rating,IFNULL((select count(*) from favourites where user_id = ' +
				request_data.user_id +
				' and post_id = posts.id),0) as is_fav from posts where status = 1 ';
			if (request_data.post_type !== 'nothing') {
				query += `and post_type = ${request_data.post_type}`;
			}
			if (search.length > 0) {
				let q = search.replace("'", "\\'");
				query += ` and (title like '%${q}%' or description like '%${q}%' or author_name like '%${q}%' or fiction like  '%${q}%' or genre like  '%${q}%'  or find_in_set('${q}',rating) <> 0 or rating like  '%${q}%')`;
			}
			query += ' order by posts.id desc limit ' + offset + ' , ' + limit;
			let result = await DB.first(query);
			const final = result.map((value) => {
				value.url = app.ImageUrl(value.url);
				if (value.audio_sample.length > 0) {
					value.audio_sample = app.ImageUrl(value.audio_sample);
				}
				if (value.audio.length > 0) {
					value.audio = app.ImageUrl(value.audio);
				}
				if (value.cover_pic.length > 0) {
					value.cover_pic = app.ImageUrl(value.cover_pic);
				}
				return value;
			});
			return app.success(res, {
				message: 'Posts',
				data: final,
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
	setImageSize: async (req, res) => {
		const widthString = req.query.width || 422;
		const heightString = req.query.height || 513;
		const format = req.query.format || 'png';
		const fileName = req.query.fileName;
		try {
			if (!fileName) {
				throw { message: 'fileName is required', code: 400 };
			}
			// Parse to integer if possible
			let width, height;
			if (widthString) {
				width = parseInt(widthString);
			}
			if (heightString) {
				height = parseInt(heightString);
			}
			// Set the content-type of the response
			res.type(`image/${format || 'png'}`);
			console.log(config.root_path + '/uploads/' + fileName);
			// Get the resized image
			resize(
				config.root_path + '/uploads/' + fileName,
				format,
				width,
				height
			).pipe(res);
		} catch (err) {
			return app.error(res, err);
		}
	},
	myPost: async (req, res) => {
		let required = {
			user_id: req.body.user_id,
			offset: req.params.offset,
		};
		try {
			const request_data = await apis.vaildation(required, {});
			let offset = (request_data.offset - 1) * 20;
			let query = 'select posts.*, ';
			query +=
				'(select count(*) from users_posts where user_id = ' +
				request_data.user_id +
				' and post_id = posts.id) as is_buy,IFNULL((select count(*) from favourites where user_id = ' +
				request_data.user_id +
				' and post_id = posts.id),0) as is_fav from posts where status = 1 and user_id = ' +
				request_data.user_id;
			query += ' order by posts.id desc limit ' + offset + ' , 20';
			let result = await DB.first(query);
			result.forEach((value, key) => {
				result[key].url = app.ImageUrl(value.url);
				if (value.audio_sample.length > 0) {
					result[key].audio_sample = app.ImageUrl(value.audio_sample);
				}
				if (value.audio.length > 0) {
					result[key].audio = app.ImageUrl(value.audio);
				}
				if (value.cover_pic.length > 0) {
					result[key].cover_pic = app.ImageUrl(value.cover_pic);
				}
			});
			return app.success(res, {
				message: 'Posts',
				data: result,
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
	addComment: async (req, res) => {
		let required = {
			user_id: req.body.user_id,
			post_id: req.body.post_id,
			comment: req.body.comment,
			rating: req.body.rating,
		};
		try {
			const request_data = await apis.vaildation(required, {});
			request_data.id = await DB.save('post_comments', request_data);
			return app.success(res, {
				message: 'Comment added successfully',
				data: request_data,
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
	getComments: async (req, res) => {
		let required = {
			post_id: req.params.post_id,
			offset: req.params.offset,
			limit: req.params.limit,
		};
		try {
			const request_data = await apis.vaildation(required, {});
			let offset = (request_data.offset - 1) * request_data.limit;
			const query =
				'select pc.*,u.name,u.email,u.profile from post_comments as pc join users as u on (pc.user_id=u.id) where post_id = ' +
				request_data.post_id +
				' order by pc.id desc limit ' +
				offset +
				', ' +
				request_data.limit;
			const data = await DB.first(query);
			data.forEach((value, key) => {
				if (value.profile.length > 0) {
					data[key].profile = app.ImageUrl(value.profile);
				}
			});
			return app.success(res, {
				message: 'comment list',
				data,
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
	async addPost(req, res) {
		const required = {
			user_id: req.body.user_id,
			post_type: req.body.post_type,
			title: req.body.title,
			description: req.body.description,
			price: req.body.price,
			status: 1,
		};
		try {
			const request_data = await apis.vaildation(required, {});
			if (req.files && req.files.url) {
				request_data.url = await app.upload_pic_with_await(req.files.url);
				delete req.files.url.data;
				request_data.metadata = JSON.stringify(req.files.url);
			}
			if (req.files && req.files.audio) {
				request_data.audio = await app.upload_pic_with_await(req.files.audio);
			}
			if (req.files && req.files.cover_pic) {
				request_data.cover_pic = await app.upload_pic_with_await(
					req.files.cover_pic
				);
			}
			if (req.files && req.files.sample_audio) {
				request_data.audio_sample = await app.upload_pic_with_await(
					req.files.sample_audio
				);
			}
			request_data.id = await DB.save('posts', request_data);
			return app.success(res, {
				message: 'post addedd successfully',
				data: request_data,
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
	homePost: async (req, res) => {
		let required = {
			user_id: req.body.user_id,
			offset: req.params.offset,
		};
		try {
			const request_data = await apis.vaildation(required, {});
			let offset = (request_data.offset - 1) * 20;
			return app.success(res, {
				message: ' Posts ',
				data: {
					pdf: await getPostBytype(1, request_data.user_id, offset),
					audio: await getPostBytype(2, request_data.user_id, offset),
					pdf_audio: await getPostBytype(3, request_data.user_id, offset),
				},
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
	payments: async (req, res) => {
		let required = {
			user_id: req.body.user_id,
			expire_month: req.body.expire_month,
			expire_year: req.body.expire_year,
			card_type: req.body.card_type,
			card_no: req.body.card_no,
			price: req.body.price,
			payment_type: req.body.payment_type, // 1-> paypal 2-> strip
		};
		try {
			const request_data = await apis.vaildation(required, {});
			if (request_data.payment_type == 1) {
				const response = await app.paypal({
					intent: 'sale',
					payer: {
						payment_method: 'paypal',
					},
					redirect_urls: {
						return_url: 'http://return.url',
						cancel_url: 'http://cancel.url',
					},
					transactions: [
						{
							item_list: {
								items: [
									{
										name: 'item',
										sku: 'item',
										price: request_data.price,
										currency: 'USD',
										quantity: 1,
									},
								],
							},
							amount: {
								currency: 'USD',
								total: request_data.price,
							},
							description: 'This is the payment description.',
						},
					],
				});
				return app.success(res, {
					message: 'payment Done successfully',
					data: response,
				});
			}
		} catch (err) {
			return app.error(res, err);
		}
	},
	favourites: async (req, res) => {
		let required = {
			user_id: req.body.user_id,
			post_id: req.body.post_id,
		};
		try {
			const request_data = await apis.vaildation(required, {});
			const is_fav = await DB.find('favourites', 'all', {
				conditions: {
					post_id: request_data.post_id,
					user_id: request_data.user_id,
				},
			});
			let message = '';
			if (is_fav.length > 0) {
				let query = 'delete from favourites where id = ' + is_fav[0].id;
				await DB.first(query);
				message = 'Post Unfav successfully';
			} else {
				await DB.save('favourites', request_data);
				message = 'Post fav successfully';
			}
			return app.success(res, {
				message: message,
				data: [],
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
	myposts: async (req, res) => {
		let required = {
			user_id: req.body.user_id,
			offset: req.params.offset,
			post_type: req.query.post_type || 1,
		};
		try {
			let request_data = await apis.vaildation(required, {});
			let offset = (request_data.offset - 1) * 20;
			let query =
				'select posts.*, users_posts.created as purchsed_date, users_posts.*, ';
			query +=
				'(select count(*) from users_posts where user_id = ' +
				request_data.user_id +
				' and post_id = posts.id) as is_buy,IFNULL((select count(*) from favourites where user_id = ' +
				request_data.user_id +
				' and post_id = posts.id),0) as is_fav from users_posts';
			query += ' join posts on (posts.id = users_posts.post_id)';
			query +=
				' where posts.status = 1 and users_posts.status =1 and users_posts.user_id=' +
				request_data.user_id;
			query +=
				' and posts.post_type = ' +
				request_data.post_type +
				' order by posts.id desc limit ' +
				offset +
				' , 20';
			let result = await DB.first(query);
			result.forEach((value, key) => {
				result[key].url = app.ImageUrl(value.url);
				if (value.audio_sample.length > 0) {
					result[key].audio_sample = app.ImageUrl(value.audio_sample);
				}
				if (value.audio.length > 0) {
					result[key].audio = app.ImageUrl(value.audio);
				}
				if (value.cover_pic.length > 0) {
					result[key].cover_pic = app.ImageUrl(value.cover_pic);
				}
			});
			return app.success(res, {
				message: ' Posts ',
				data: result,
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
	favPost: async (req, res) => {
		let required = {
			user_id: req.body.user_id,
			offset: req.params.offset,
			post_type: req.query.post_type || 1,
		};
		try {
			let request_data = await apis.vaildation(required, {});
			let offset = (request_data.offset - 1) * 20;
			let query = 'select posts.*, ';
			query +=
				'(select count(*) from users_posts where user_id = ' +
				request_data.user_id +
				' and post_id = posts.id) as is_buy,IFNULL((select count(*) from favourites where user_id = ' +
				request_data.user_id +
				' and post_id = posts.id),0) as is_fav from favourites';
			query += ' join posts on (posts.id = favourites.post_id)';
			query +=
				' where posts.status = 1  and favourites.user_id=' +
				request_data.user_id +
				' and posts.post_type = ' +
				request_data.post_type;
			query += ' order by posts.id desc limit ' + offset + ' , 20';
			let result = await DB.first(query);
			result.forEach((value, key) => {
				result[key].url = app.ImageUrl(value.default_url);
				if (value.audio_sample.length > 0) {
					result[key].audio_sample = app.ImageUrl(value.audio_sample);
				}
				if (value.audio.length > 0) {
					result[key].audio = app.ImageUrl(value.audio);
				}
				if (value.cover_pic.length > 0) {
					result[key].cover_pic = app.ImageUrl(value.cover_pic);
				}
			});
			return app.success(res, {
				message: 'fav Posts ',
				data: result,
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
	postDetails: async (req, res) => {
		let required = {
			user_id: req.body.user_id,
			post_id: req.params.post_id,
		};
		try {
			let request_data = await apis.vaildation(required, {});
			return app.success(res, {
				message: 'post details',
				data: await post_details(request_data.post_id, request_data.user_id),
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
	checkCoupon: async (req, res) => {
		const required = {
			coupon: req.body.coupon,
			user_id: req.body.user_id,
			post_id: req.body.post_id,
		};
		try {
			const requestData = await apis.vaildation(required, {});
			const { user_id, coupon, post_id } = requestData;
			const postDetails = await DB.find('posts', 'first', {
				conditions: {
					id: post_id,
				},
			});
			if (!postDetails) {
				throw { message: 'Invaild post id', code: 400 };
			}
			let coupon_type = '';
			if (postDetails.rsb === 1 && postDetails.lbr === 1) {
				coupon_type = '';
			} else if (postDetails.rsb === 1 && postDetails.lbr !== 1) {
				coupon_type = ` and coupon_type = 'rsb' `;
			} else if (postDetails.lbr === 1 && postDetails.rsb !== 1) {
				coupon_type = ` and coupon_type = 'lbr' `;
			} else if (postDetails.rsb === 0 && postDetails.lbr === 0) {
				coupon_type = ` and coupon_type = 'discount' `;
			} else {
				throw { message: 'Purchase not eligible for coupon code.', code: 400 };
			}
			const data = await DB.first(
				`select coupons.*, (select count(*) from apply_coupons where user_id = ${user_id} and coupon_id = coupons.id) as totalUse from coupons where name = '${coupon}' and  (select count(*) from apply_coupons where user_id = ${user_id} and coupon_id = coupons.id) < 1000 limit 1`
			);

			if (data.length === 0) {
				// eslint-disable-next-line no-throw-literal
				throw { message: 'Invaild coupon code', code: 400 };
			} else if (
				postDetails.rsb === 1 &&
				postDetails.lbr !== 1 &&
				data[0].coupon_type !== 'rsb' &&
				data[0].coupon_type !== 'discount'
			) {
				// eslint-disable-next-line no-throw-literal
				throw { message: 'Invaild coupon code', code: 400 };
			} else if (
				postDetails.lbr === 1 &&
				postDetails.rsb !== 1 &&
				data[0].coupon_type !== 'lbr' &&
				data[0].coupon_type !== 'discount'
			) {
				// eslint-disable-next-line no-throw-literal
				throw { message: 'Invaild coupon code', code: 400 };
			}
			if (data[0].totalUse > 1) {
				throw { message: 'You have already use this coupon', code: 400 };
			}
			if (app.currentTime > app.setHours(data[0].end_time)) {
				throw { message: 'Coupon was expired', code: 400 };
			}
			//&& data[0].coupon_type === 'discount'
			if (2.98 >= postDetails.price) {
				throw {
					message:
						'Discount Coupon Code applies to Regular Priced items $2.99 or more.',
					code: 400,
				};
			}
			if (data[0].coupon_type === 'discount' && postDetails.sale_price !== 0) {
				throw { message: 'Coupon code is not eligible', code: 400 };
			}
			return app.success(res, {
				message: 'post details',
				data: data[0],
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
	buyPost: async (req, res) => {
		const required = {
			user_id: req.body.user_id,
			post_id: req.body.post_id,
			payment_type: req.body.payment_type,
			payment_details: req.body.payment_details,
			amount: req.body.amount,
			status: req.body.status,
			coupon_id: req.body.coupon_id || 0,
			discount: req.body.discount || 0,
			tax_state: req.body.tax_state || '0',
			country: req.body.country || '0',
			tax_rate: req.body.tax_rate || '0',
			country_rate: req.body.country_rate || '0',
			tax_amount: req.body.tax_amount || '0',
		};
		try {
			const request_data = await apis.vaildation(required);
			let insertId = await DB.save('users_posts', request_data);
			if (parseInt(request_data.coupon_id) !== 0) {
				const { coupon_id, user_id } = request_data;
				DB.save('apply_coupons', {
					coupon_id,
					user_id,
				});
			}
			return app.success(res, {
				message: 'buy successfully',
				data: await postDetails(insertId),
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
};

const postDetails = async function (id) {
	let query = 'select  posts.*, 1 as is_buy from ';
	query +=
		'posts join users_posts on (posts.id = users_posts.post_id) where posts.id = ' +
		id +
		' limit 1';
	let result = await DB.first(query);
	result.forEach((value, key) => {
		result[key].url = app.ImageUrl(value.url);
		if (value.audio_sample.length > 0) {
			result[key].audio_sample = app.ImageUrl(value.audio_sample);
		}
		if (value.audio.length > 0) {
			result[key].audio = app.ImageUrl(value.audio);
		}
		if (value.cover_pic.length > 0) {
			result[key].cover_pic = app.ImageUrl(value.cover_pic);
		}
	});
	return result[0];
};

const post_details = async (post_id, user_id) => {
	try {
		var query = 'select posts.*, ';
		query +=
			'(select count(*) from users_posts where user_id = ' +
			user_id +
			' and post_id = posts.id) as is_buy, IFNULL((select avg(rating) from post_comments where post_id = posts.id),0) as post_rating,IFNULL((select count(*) from favourites where user_id = ' +
			user_id +
			' and post_id = posts.id), 0 ) as is_fav from posts where id =  ' +
			post_id;
		query += ' order by posts.id desc limit 1';
		const pdf = await DB.first(query);
		pdf.forEach((value, key) => {
			pdf[key].url = app.ImageUrl(value.url);
			if (value.audio_sample.length > 0) {
				pdf[key].audio_sample = app.ImageUrl(value.audio_sample);
			}
			if (value.audio.length > 0) {
				pdf[key].audio = app.ImageUrl(value.audio);
			}
			if (value.cover_pic.length > 0) {
				pdf[key].cover_pic = app.ImageUrl(value.cover_pic);
			}
		});
		return pdf[0];
	} catch (error) {
		throw error;
	}
};
const getPostBytype = async (type, user_id, offset) => {
	try {
		var query = 'select posts.*, ';
		query +=
			'(select count(*) from users_posts where user_id = ' +
			user_id +
			' and post_id = posts.id) as is_buy, IFNULL((select avg(rating) from post_comments where post_id = posts.id),0) as post_rating,IFNULL((select count(*) from favourites where user_id = ' +
			user_id +
			' and post_id = posts.id), 0 ) as is_fav from posts where status = 1 and post_type =  ' +
			type;
		query += ' order by posts.id desc limit ' + offset + ' , 10';
		let pdf = await DB.first(query);
		pdf.forEach((value, key) => {
			pdf[key].url = app.ImageUrl(value.url);
			if (value.audio_sample.length > 0) {
				pdf[key].audio_sample = app.ImageUrl(value.audio_sample);
			}
			if (value.audio.length > 0) {
				pdf[key].audio = app.ImageUrl(value.audio);
			}
			if (value.cover_pic.length > 0) {
				pdf[key].cover_pic = app.ImageUrl(value.cover_pic);
			}
		});
		return pdf;
	} catch (error) {
		throw error;
	}
};
