require('dotenv').config();
const stripKey =
	process.env.STRIP_KEY || 'sk_live_QX4bw5EKbE8xhvLLNrw7OgQs0029hoOsdO';
const stripe = require('stripe')(stripKey);
const app = require('../../../libary/CommanMethod');
module.exports = {
	createStripeSecert: async (Request, response) => {
		try {
			const { amount = 0, currency = 'usd' } = Request.body;
			if (amount === 0)
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
			return app.error(response, err);
		}
	},
};
