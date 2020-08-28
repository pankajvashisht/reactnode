const express = require('express');
const router = express.Router();
const { adminController } = require('../src/Controller/admin/index');
const { cross, AdminAuth } = require('../src/middleware/index');
const response = require('../libary/Response');
let admin = new adminController();

router.use([cross, AdminAuth]);
router.get('/', function (req, res) {
	res.json(' APi workings ');
});
router.post('/login', admin.login);
router.post('/forget-password', admin.forgetPassword);
router.post('/update-admin', response(admin.updateAdmin));
router.get('/checkAuth', admin.islogin);
router.get('/dashboard', response(admin.dashboard));
router.get(
	'/transaction/:offset([0-9]+)?/:limit([0-9]+)?',
	response(admin.transaction)
);
router
	.route('/users/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(admin.allUser))
	.post(response(admin.addUser))
	.put(response(admin.updateData))
	.delete(response(admin.deleteData));
router
	.route('/posts/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(admin.allPost))
	.post(response(admin.addPost))
	.put(response(admin.updateData))
	.delete(response(admin.deleteData));
router
	.route('/admins/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(admin.allAdmins))
	.post(response(admin.addAdmin))
	.delete(response(admin.deleteData));
router
	.route('/app-info')
	.get(response(admin.appInfo))
	.put(response(admin.updateAppInfo));
router
	.route('/review/:post_id([0-9]+)/:limit([0-9]+)?')
	.get(response(admin.getReview));
router
	.route('/coupon/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(admin.getCoupons))
	.post(response(admin.addCoupon))
	.put(response(admin.updateData))
	.delete(response(admin.deleteData));
module.exports = router;
