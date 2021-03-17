const express = require('express');
const router = express.Router();
const {
	UserController,
	PostController,
	PaymentController,
} = require('../src/Controller/v1/index');
const { UserAuth, cross } = require('../src/middleware/index');
let user = new UserController();
console.log(PaymentController);
router.use(cross);
router.get('/', function (req, res) {
	res.send(' APi workings ');
});

router.post('/user/signup', user.addUser);
router.post('/user/login', user.loginUser);
router.post('/user/edit', UserAuth, user.updateProfile);
router.get('/post/:offset([0-9]+)?', UserAuth, PostController.getPost);
router.get('/mypost/:offset([0-9]+)?', UserAuth, PostController.myposts);
router.get('/home/:offset([0-9]+)?', UserAuth, PostController.homePost);
router.post('/post', UserAuth, PostController.buyPost);
router.post('/user/verifiy', UserAuth, user.verifyOtp);
router.post('/favourite', UserAuth, PostController.favourites);
router.post('/stripe-secert', UserAuth, PaymentController.createStripeSecert);
router.get('/resize', PostController.setImageSize);
router.post('/brain-tree-token', PaymentController.createBrianTreeToken);
router.get('/myPost/:offset([0-9]+)?', UserAuth, PostController.myPost);
router.get(
	'/comment/:post_id([0-9]+)/:offset([0-9]+)?/:limit([0-9]+)?',
	UserAuth,
	PostController.getComments
);
router.post('/comment', UserAuth, PostController.addComment);
router.post('/post', UserAuth, PostController.addPost);
router.get(
	'/post/details/:post_id([0-9]+)',
	UserAuth,
	PostController.postDetails
);
router.get('/favourite/:offset([0-9]+)?', UserAuth, PostController.favPost);
router.post('/do-payment', UserAuth, PostController.payments);
router.post(
	'/brain-tree-payment',
	UserAuth,
	PaymentController.completeBrainPayment
);
router.post('/user/forgot_password', user.forgotPassword);
router.post('/user/logout', UserAuth, user.logout);
router.post('/check-coupon', UserAuth, PostController.checkCoupon);
router.get('/app_info', user.appInfo);

module.exports = router;
