/*
 * v1
 * auth pankaj vashisht @sharmapankaj688@gmail.com
 * helper can used in the whole app for sending mail , push  , payment etc work.
 * function with anysc , await or without anysc awit .
 */

/**
 * first import the configration file after get the all configration
 * send mail , push , file upload etc .
 * when function cal then that file import at moment.
 */
const config = require('../config/config');
const SMS = require('../config/message');
const payment = require('../config/payment');
const fs = require('fs');
const crypto = require('crypto');
const FCM = require('fcm-node');
const twilio = require('twilio');
const mails = require('../config/mails');
const { MailClient } = require('./mails');
module.exports = {
	send_mail: function (object) {
		const Sendmails = new MailClient(mails[mails.default]);
		Sendmails.to(object.to)
			.subject(object.subject)
			.html(object.template, object.data)
			.send();
	},
	upload_pic_with_await: function (
		file,
		folder_name = 'uploads/',
		unlink = null
	) {
		try {
			if (!file) {
				return false; // if not getting the image
			} else {
				if (unlink) {
				}

				let upload_path = global.appRoot + '/public/' + folder_name;
				let image = file;
				let image_array = image.mimetype.split('/');
				let extension = image_array[image_array.length - 1];
				var timestamp = parseInt(new Date().getTime());
				image.mv(upload_path + '/' + timestamp + '.' + extension, function (
					err
				) {
					if (err) {
						console.log(err);
					} else {
						console.log('file_uploaded');
					}
				});
				return timestamp + '.' + extension;
			}
		} catch (err) {
			throw { code: 415, message: err };
		}
	},
	sendSMS: (data) => {
		const { SID, AUTHTOKENSMS, SENDERNUMBER } = SMS[SMS.default];
		const client = new twilio(SID, AUTHTOKENSMS);
		client.messages
			.create({
				body: data.message,
				to: `+${data.to}`, // Text this number
				from: SENDERNUMBER, // From a valid Twilio number
			})
			.then((message) => console.log(message.sid))
			.catch((err) => {
				console.log(err);
			});
	},
	send_push: function (data) {
		const serverKey = config.GOOGLE_KEY; //put your server key here
		const fcm = new FCM(serverKey);
		delete data.data.message_type;
		let message = {
			//this may vary according to the message type (single recipient, multicast, topic, et cetera)
			to: data.token,
			collapse_key: 'your_collapse_key',

			notification: {
				title: config.AppName,
				body: data.message,
			},

			data,
		};
		console.log('push testing', message);
		try {
			fcm.send(message, function (err, response) {
				if (err) {
					console.log(err);
					return false;
				} else {
					console.log('Successfully sent with response: ', response);
					return true;
				}
			});
		} catch (err) {
			throw err;
		}
	},
	send_push_apn: function () {},
	paypal: async function (payment_info) {
		const paypal = require('paypal-rest-sdk');
		paypal.configure(payment.paypal);
		const result = new Promise((resolved, reject) => {
			paypal.payment.create(payment_info, function (error, payment) {
				if (error) reject(error);
				console.log('Create Payment Response');
				console.log(payment);
				resolved(payment);
			});
		});
		return result;
	},
	stripe: async function () {
		const stripe = require('stripe')(payment.stripe);
	},
	brain_tree: async function () {},
	error: function (res, err) {
		try {
			let code =
				typeof err === 'object'
					? err.hasOwnProperty('code')
						? err.code
						: 500
					: 403;
			let message =
				typeof err === 'object'
					? err.hasOwnProperty('message')
						? err.message
						: err
					: err;
			res.status(code).json({
				success: false,
				error_message: message,
				code: code,
				data: [],
			});
		} catch (error) {
			return res.status(500).json(error);
		}
	},
	success: function (res, data) {
		res.json({
			success: true,
			message: data.message,
			code: 200,
			data: data.data,
		});
	},
	loadModel: function (file_name = null) {
		try {
			if (fs.existsSync(config.root_path + 'model/' + file_name + '.js')) {
				let models = require('../model/' + file_name);
				return new models();
			} else {
				let message =
					'Model ' +
					file_name +
					' Not Found on the server.Please create the ' +
					file_name +
					' in model folder.';
				throw { code: 404, message };
			}
		} catch (err) {
			throw err;
		}
	},
	modelvalidation: function (model_data, user_data) {
		try {
		} catch (err) {
			throw err;
		}
	},
	createToken() {
		let key = 'abc' + new Date().getTime();
		return crypto.createHash('sha1').update(key).digest('hex');
	},
	createHash(key, hash = 'sha1') {
		return crypto.createHash(hash).update(key).digest('hex');
	},
	UserToken: function (id, req) {
		const clientIp = req.connection.remoteAddress;
		const {
			isMobile,
			isDesktop,
			browser,
			version,
			os,
			platform,
			source,
		} = req.useragent;
		let token =
			id +
			clientIp +
			isMobile +
			isDesktop +
			os +
			version +
			platform +
			source +
			browser;
		return this.createHash(token);
	},
	ImageUrl(name, folder = 'uploads') {
		let ip = '18.221.216.40';
		return 'http://' + ip + ':' + config.port + '/' + folder + '/' + name;
	},
	randomNumber() {
		return Math.floor(1000 + Math.random() * 9000);
	},
	convertTime(date) {
		return Math.round(new Date(date).getTime() / 1000, 0);
	},
	get currentTime() {
		return Math.round(new Date().getTime() / 1000, 0);
	},
	createRandomNubmer(length = 5) {
		let result = '';
		let characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	},
};
