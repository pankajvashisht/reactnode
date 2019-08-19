const express = require("express");
const router = express.Router();
const { UserController,PostController } = require("../src/Controller/v1/index");
const { UserAuth, cross } = require("../src/middleware/index");
let user = new UserController();

router.use(cross);
router.get("/", function(req, res) {
  res.send(" APi workings ");
});

router.post("/user", user.addUser);
router.post("/user/login", user.loginUser);
router.post("/user/edit", UserAuth, user.updateProfile);
router.get("/post/:offset([0-9]+)?", UserAuth, PostController.getPost);
router.get("/mypost/:offset([0-9]+)?", UserAuth, PostController.myposts);
router.post("/post", UserAuth, PostController.buyPost);
router.post('/user/verifiy', UserAuth, user.verifyOtp);
router.post('/user/forgot_password', user.forgotPassword);
router.get('/app_info', user.appInfo);

module.exports = router;
