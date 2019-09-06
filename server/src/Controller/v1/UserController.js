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
    let required = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      checkexist: 1
    };
    let non_required = {
      device_type: req.body.device_type,
      device_token: req.body.device_token,
      authorization_key: app.createToken(),
      otp: app.randomNumber()
    };
    try {
      let request_data = await apis.vaildation(required, non_required);
      if (req.files && req.files.profile) {
        request_data.profile = await app.upload_pic_with_await(
          req.files.profile
        );
      }
      let insert_id = await DB.save("users", request_data);
      request_data.id = insert_id;
      app.success(res, {
        message: "User signup successfully",
        data: {
          authorization_key: request_data.authorization_key
        }
      });
      let mail = {
        to: request_data.email,
        subject: "Signup User",
        text:
          "Your one time password is " +
          request_data.otp +
          " Please Dont share with any one eles"
      };
      await app.send_mail(mail);
    } catch (err) {
      app.error(res, err);
    }
  }

  async verifyOtp(req, res) {
    try {
      let required = {
        otp: req.body.otp
      };
      let non_required = {};

      let request_data = await super.vaildation(required, non_required);
      if (request_data.otp != req.body.userInfo.otp) {
        throw " Invaild Otp ";
      }
      req.body.userInfo.status = 1;
      await DB.save("users", req.body.userInfo);
      app.success(res, {
        message: " Otp verify Successfully",
        data: await super.userDetails(req.body.userInfo.id)
      });
    } catch (err) {
      app.error(res, err);
    }
  }

  async forgotPassword(req, res) {
    try {
      let required = {
        email: req.body.email,
        otp: app.randomNumber()
      };
      let non_required = {};

      let request_data = await super.vaildation(required, non_required);
      let user_info = await DB.find("users", "first", {
        conditions: {
          email: request_data.email
        },
        fields: ["id", "email"]
      });
      if (!user_info) throw "Email not found";
      user_info.otp = request_data.otp;
      await DB.save("users", user_info);
      let mail = {
        to: request_data.email,
        subject: "Forgot Password",
        text:
          "Your one time password is " +
          request_data.otp +
          " Please Dont share with any one eles"
      };
      await app.send_mail(mail);
      return app.success(res, {
        message: "Otp send your register email",
        data: []
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
          "profile",
          "phone",
          "status"
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
        if (login_details.profile.length > 0) {
          login_details.profile = app.ImageUrl(login_details.profile);
        }
        return app.success(res, {
          message: "User login successfully",
          data: login_details
        });
      }
      throw "Wrong Email or password";
    } catch (err) {
      app.error(res, err);
    }
  }

  async appInfo(req, res) {
    try {
      let app_info = await DB.find("app_information", "all");
      app.success(res, {
        message: "App Information",
        data: app_info
      });
    } catch (err) {
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
      const usersinfo = await super.userDetails(request_data.id);
      if (usersinfo.profile.length > 0) {
        usersinfo.profile = app.ImageUrl(usersinfo.profile);
      }
      return app.success(res, {
        message: "all users list",
        data: usersinfo
      });
    } catch (err) {
      app.error(res, err);
    }
  }
}

module.exports = UserController;
