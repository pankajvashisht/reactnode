const express = require("express");
const router = express.Router();
const { adminController } = require("../src/Controller/admin/index");
const { cross, AdminAuth } = require("../src/middleware/index");
const response = require("../libary/Response");
let admin = new adminController();

router.use([cross, AdminAuth]);
router.get("/", function(req, res) {
  res.json(" APi workings ");
});
router.post("/login", admin.login);
router.get("/checkAuth", admin.islogin);
router.get("/dashboard", response(admin.dashboard));
router.get(
  "/transaction/:offset([0-9]+)?/:limit([0-9]+)?",
  response(admin.transaction)
);
router
  .route("/users/:offset([0-9]+)?/:limit([0-9]+)?")
  .get(response(admin.allUser))
  .post(response(admin.addUser))
  .put(response(admin.updateData))
  .delete(response(admin.deleteData));
router
  .route("/posts:offset([0-9]+)?/:limit([0-9]+)?")
  .get(response(admin.allPost))
  .post(response(admin.addPost))
  .put(response(admin.updateData))
  .delete(response(admin.deleteData));
module.exports = router;
