require('dotenv').config();
const braintree = require('braintree');
const ApiController = require('./ApiController');
const stripKey =
	process.env.STRIP_KEY || 'sk_test_asWiwURMo5A3rKHzLWW6OvHz00TvWHSLvN';
const stripe = require('stripe')(stripKey);
const app = require('../../../libary/CommanMethod');
const gateway = new braintree.BraintreeGateway({
	environment:
		process.env.PAYMENT_MODE === 'dev'
			? braintree.Environment.Sandbox
			: braintree.Environment.Production,
	merchantId: process.env.MERCHANTID || '36m87pv4rfw2hmm6',
	publicKey: process.env.PUBLIC_KEY || '8jvfj3x967js2wzh',
	privateKey: process.env.PRIVATE_KEY || '51a06aeba5333d18476d9be72982c9b7',
});
const helper = new ApiController();

module.exports = {
	createStripeSecert: async (Request, response) => {
		try {
			const { amount = 0, currency = 'usd' } = Request.body;
			if (amount === 0)
				// eslint-disable-next-line no-throw-literal
				throw { message: 'Amount field is required', code: 400 };

			const paymentIntent = await stripe.paymentIntents.create({
				amount,
				currency,
			});
			const clientSecret = paymentIntent.client_secret;
			return app.success(response, {
				message: 'Stripe Secert Key',
				data: {
					secret: clientSecret,
				},
			});
		} catch (err) {
			console.log(err);
			return app.error(response, err);
		}
	},
	createBrianTreeToken: async (req, res) => {
		try {
			const token = await gateway.clientToken.generate({});
			return app.success(res, {
				message: 'Brain tree',
				data: {
					token,
				},
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
	completeBrainPayment: async (
		{ body: { event_id, deviceData, paymentMethodNonce, amount } },
		res
	) => {
		try {
			await helper.vaildation(
				{
					amount,
					paymentMethodNonce,
					deviceData,
					event_id,
				},
				{}
			);

			const saleRequest = {
				amount,
				paymentMethodNonce,
				deviceData,
				orderId: event_id,
				options: {
					submitForSettlement: true,
				},
			};

			const transaction = await gateway.transaction.sale(saleRequest);
			return app.success(res, {
				message: 'Brain tree',
				data: {
					transaction,
				},
			});
		} catch (err) {
			return app.error(res, err);
		}
	},
};
