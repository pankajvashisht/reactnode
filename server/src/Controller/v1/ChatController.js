const ApiController = require("./ApiController");
const app = require("../../../libary/CommanMethod");
const Db = require("../../../libary/sqlBulider");

const DB = new Db();

class ChatController extends ApiController {
  constructor() {
    super();
  }

  async sendMessage(req, res) {
    try {
      let required = {
        friend_id: req.body.friend_id,
        user_id: req.body.user_id,
        message_type: req.body.message_type, // 1-> text 2-> media
        message: req.body.message
      };
      let non_required = {};
      let request_data = await super.vaildation(required, non_required);
      let query =
        "select * from threads where (user_id = " +
        request_data.user_id +
        " and friend_id = " +
        request_data.friend_id;
      query +=
        " ) or (user_id = " +
        request_data.friend_id +
        " and friend_id = " +
        request_data.user_id +
        ") limit 1";

      let threads = await DB.first(query);

      if (threads.length > 0) {
        request_data.thread_id = threads[0].id;
      } else {
        request_data.thread_id = await DB.save("threads", request_data);
      }
      request_data.sender_id = request_data.user_id;
      request_data.receiver_id = request_data.friend_id;
      request_data.id = await DB.save("chats", request_data);
      app.success(res, {
        message: "Message send Successfully",
        data: request_data
      });

      let object = {
        id: request_data.thread_id,
        last_chat_id: request_data.id
      };
      DB.save("threads", object);
    } catch (err) {
      console.log(err);
      app.error(res, err);
    }
  }

  async getMessage(req, res) {
    try {
      let required = {
        friend_id: req.params.friend_id,
        user_id: req.body.user_id
      };
      let non_required = {};
      let request_data = await super.vaildation(required, non_required);

      let query =
        "select * from chats where (sender_id = " +
        request_data.user_id +
        " and receiver_id = " +
        request_data.friend_id;
      query +=
        " ) or (sender_id = " +
        request_data.friend_id +
        " and receiver_id = " +
        request_data.user_id +
        ") limit 100";

      let chats = await DB.first(query);
      app.success(res, {
        message: "All Chats",
        data: chats
      });
    } catch (err) {
      app.error(res, err);
    }
  }

  async lastChat(req, res) {
    try {
      let required = {
        user_id: req.body.user_id
      };
      let non_required = {};
      let request_data = await super.vaildation(required, non_required);

      let query =
        "select chats.*, users.id as friend_id, users.profile, users.email, users.name, users.gender, users.interest ";
      query += "from threads join chats on (chats.id = threads.last_chat_id) ";
      query +=
        "join users on (users.id = IF(user_id = " +
        request_data.user_id +
        ", friend_id, user_id ))";
      query +=
        "where user_id = " +
        request_data.user_id +
        " or  friend_id = " +
        request_data.user_id +
        " order by chats.id desc";

      let last_chats = await DB.first(query);
      app.success(res, {
        message: "last Chats",
        data: last_chats
      });
    } catch (err) {
      app.error(res, err);
    }
  }

  updateLastId(...data) {
    const { id, last_chat_id } = data;
  }
}

module.exports = ChatController;
