const ApiController = require("./ApiController");
const app = require("../../../libary/CommanMethod");
const Db = require("../../../libary/sqlBulider");
const DB = new Db();
let apis = new ApiController();

class UserController extends ApiController {
  constructor() {
    super();
  }

  async addUser(req, res) {
    try {
      let required = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        interest: req.body.interest,
        checkexist: 1
      };
      let non_required = {
        device_type: req.body.device_type,
        device_token: req.body.device_token,
        authorization_key: app.createToken()
      };

      let request_data = await apis.vaildation(required, non_required);
      let insert_id = await DB.save("users", request_data);
      request_data.id = insert_id;
      app.success(res, {
        message: "User signup successfully",
        data: {
          authorization_key: request_data.authorization_key
        }
      });
    } catch (err) {
      app.error(res, err);
    }
  }

  async loginUser(req, res) {
    try {
      let required = {
        email: req.body.email,
        password: req.body.password
      };
      let non_required = {
        device_type: req.body.device_type,
        device_token: req.body.device_token,
        authorization_key: app.createToken()
      };

      let request_data = await super.vaildation(required, non_required);
      let login_details = await DB.find("users", "first", {
        conditions: {
          email: request_data.email
        },
        fields: [
          "id",
          "name",
          "password",
          "email",
          "authorization_key",
          "gender",
          "social_id",
          "social_token",
          "interest",
          "profile"
        ]
      });
      if (login_details) {
        if (request_data.password != login_details.password)
          throw "Wrong Email or password";
        delete login_details.password;
        await DB.save("users", {
          id: login_details.id,
          device_type: request_data.device_type,
          device_token: request_data.device_type,
          authorization_key: request_data.authorization_key
        });
        login_details.authorization_key = request_data.authorization_key;
        app.success(res, {
          message: "User login successfully",
          data: login_details
        });
      }
      throw "Wrong Email or password";
    } catch (err) {
      app.error(res, err);
    }
  }

  async soicalLogin(req, res) {
    try {
      let required = {
        social_id: req.body.social_id,
        social_token: req.body.social_token,
        soical_type: req.body.soical_type
      };
      let non_required = {
        device_type: req.body.device_type,
        device_token: req.body.device_token,
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        authorization_key: app.createToken()
      };

      let request_data = await super.vaildation(required, non_required);
      let soical_id = await DB.find("users", "first", {
        conditions: {
          or: {
            email: request_data.email,
            social_id: request_data.social_id
          }
        },
        fields: ["id"]
      });
      if (soical_id) {
        request_data.id = soical_id.id;
      }
      let id = await DB.save("users", request_data);
      app.success(res, {
        message: "User login successfully",
        data: await super.userDetails(id)
      });
    } catch (err) {
      console.log(err);
      app.error(res, err);
    }
  }

  async UserLike(req, res) {
    try {
      let required = {
        friend_id: req.body.friend_id,
        user_id: req.body.user_id,
        type: req.body.type // 1-> like 2-> dislike
      };
      let non_required = {};
      let request_data = await super.vaildation(required, non_required);
      let find_user = await DB.find("likes", "first", {
        conditions: {
          user_id: request_data.friend_id,
          friend_id: request_data.user_id,
          type: 1
        }
      });
      let is_match = false;
      if (find_user && request_data.type == 1) {
        is_match = true;
      }
      let old_like = await DB.find("likes", "first", {
        conditions: {
          user_id: request_data.user_id,
          friend_id: request_data.friend_id,
          type: 1
        }
      });
      if (old_like) {
        request_data.id = old_like.id;
      }
      await DB.save("likes", request_data);
      app.success(res, {
        message: "Action successfully",
        data: {
          is_match
        }
      });
    } catch (err) {
      console.log(err);
      app.error(res, err);
    }
  }

  async allUsers(req, res) {
    try {
      let request_data = {
        offset: req.params.offset,
        limit: 20
      };
      let all_users = await DB.find("users", "all", {
        conditions: {
          1:
            " > (select count(id) from likes where user_id = " +
            req.body.user_id +
            " and friend_id = users.id)",
          gender: req.body.userInfo.interest
        },
        fields: [
          "id",
          "name",
          "email",
          "gender",
          "social_id",
          "social_token",
          "interest",
          "profile"
        ]
      });
      app.success(res, {
        message: "all users list",
        data: all_users
      });
    } catch (err) {
      console.log(err);
      app.error(res, err);
    }
  }

  async updateProfile(req, res) {
    try {
      let required = {
        id: req.body.user_id
      };
      let non_required = {
        gender: req.body.gender,
        interest: req.body.interest,
        name: req.body.name
      };
      let request_data = await super.vaildation(required, non_required);
      if (req.files && req.files.profile) {
        request_data.profile = await app.upload_pic_with_await(
          req.files.profile
        );
      }
      await DB.save("users", request_data);
      app.success(res, {
        message: "all users list",
        data: await super.userDetails(request_data.id)
      });
    } catch (err) {
      console.log(err);
      app.error(res, err);
    }
  }
}

module.exports = UserController;
