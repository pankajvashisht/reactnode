const Db = require("../../libary/sqlBulider");
const app = require("../../libary/CommanMethod");
const DB = new Db();

const UserAuth = async (req, res, next) => {
  try {
    if (!req.headers.hasOwnProperty("authorization_key")) {
      throw { code: 400, message: "authorization_key key is required" };
    }
    let user_details = await DB.find("users", "first", {
      conditions: {
        authorization_key: req.headers.authorization_key
      },
      fields: [
        "id",
        "name",
        "email",
        "authorization_key",
        "gender",
        "social_id",
        "social_token",
        "interest",
        "profile"
      ]
    });
    if (user_details) {
      req.body.user_id = user_details.id;
      req.body.userInfo = user_details;
      next();
      return;
    }
    throw { code: 401, message: "Invaild Authorization" };
  } catch (err) {
    app.error(res, err);
  }
};

module.exports = UserAuth;
