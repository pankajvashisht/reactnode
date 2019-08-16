const express = require("express");
const router = express.Router();
const UserController = require("../src/Controller/v1/UserController");
const ChatController = require("../src/Controller/v1/ChatController");
const UserAuth = require("../src/middleware/UserAuth");

let user = new UserController();
let Chat = new ChatController();

router.get("/", function(req, res) {
  res.send(" APi workings ");
});

router.post("/user", user.addUser);
router.post("/user/login", user.loginUser);
router.post("/user/soical_login", user.soicalLogin);
router.post("/user/like", UserAuth, user.UserLike);
router.get("/user/:offset([0-9]+)", UserAuth, user.allUsers);
router.get(
  "/chat/:friend_id([0-9]+)/:offset([0-9]+)?",
  UserAuth,
  Chat.getMessage
);
router.get("/chat/last/:offset([0-9]+)?", UserAuth, Chat.lastChat);
router.post("/chat/send_message", UserAuth, Chat.sendMessage);
router.post("/user/edit", UserAuth, user.updateProfile);

module.exports = router;
