const Db = require("../../../libary/sqlBulider");
const app = require("../../../libary/CommanMethod");
let DB = new Db();

class adminController {
  constructor() {
    this.limit = 20;
    this.offset = 1;
    this.login = this.login.bind(this);
    this.islogin = this.islogin.bind(this);
    this.allUser = this.allUser.bind(this);
    this.allPost = this.allPost.bind(this);
    this.transaction = this.transaction.bind(this);
  }
  async login(req, res) {
    const { body } = req;
    try {
      let login_details = await DB.find("admins", "first", {
        conditions: {
          email: body.email
        }
      });
      if (login_details) {
        if (app.createHash(body.password) != login_details.password)
          throw "Wrong Email or password";
        delete login_details.password;
        let token = await app.UserToken(login_details.id, req);
        await DB.save("admins", {
          id: login_details.id,
          token: token
        });
        login_details.token = token;
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
  async allUser(req) {
    let offset = req.params.offset !== undefined ? req.params.offset : 1;
    let limit = req.params.limit !== undefined ? req.params.limit : 20;
    offset = (offset - 1) * limit;
    let conditions = "";
    if (req.query.q.length > 0 && req.query.q !== 'undefined') {
      conditions +=
        " where name like '%" +
        req.query.q +
        "%' or email like '%" +
        req.query.q +
        "%'";
    }
    let query =
      "select * from users " +
      conditions +
      " order by id desc limit " +
      offset +
      " , " +
      limit;
    return this.addUrl(await DB.first(query), "profile");
  }

  async allPost(req) {
    let offset = req.params.offset !== undefined ? req.params.offset : 1;
    let limit = req.params.limit !== undefined ? req.params.limit : 20;
    offset = (offset - 1) * limit;
    let conditions = "";
    if (req.query.q.length > 0) {
      conditions +=
        " where title like '%" +
        req.query.q +
        "%' or description like '%" +
        req.query.q +
        "%'";
    }
    let query =
      "select * from posts " +
      conditions +
      " order by id desc limit " +
      offset +
      " , " +
      limit;
    return this.addUrl(await DB.first(query), ["url","audio"]);
  }

  addUrl(data, key) {
    if (data.length === 0) {
      return [];
    }
    data.forEach((element, keys) => {
      if (!Array.isArray(key)) {
        data[keys][key] = app.ImageUrl(data[keys][key]);
      } else {
        data[keys][key[0]] = app.ImageUrl(data[keys][key[0]]);
        data[keys][key[1]] = app.ImageUrl(data[keys][key[1]]);
      }
    });
    return data;
  }

  async addPost(req, res, next) {
    const { body } = req;
    try {
      if (req.files && req.files.url) {
        body.url = await app.upload_pic_with_await(req.files.url);
        delete req.files.url.data;
        body.metadata = JSON.stringify(req.files.url);
      }
      if (req.files && req.files.audio) {
        body.audio = await app.upload_pic_with_await(req.files.audio);
      }
      if (req.files && req.files.audio_sample) {
        body.audio_sample = await app.upload_pic_with_await(req.files.audio_sample);
      }
      return await DB.save("posts", body);
    } catch (err) {
      next(err);
    }
  }
  async addUser(req, res) {
    const { body } = req;
    delete body.profile;
    console.log(body);
    try {
      console.log(req.files);
      if (req.files && req.files.profile) {
        body.profile = await app.upload_pic_with_await(req.files.profile);
      }
      return await DB.save("users", body);
    } catch (err) {
      console.log(JSON.stringify(err));
      throw new Error(JSON.stringify(err));
    }
  }

  async updateData(req, res, next) {
    const { body } = req;
    try {
      if (body.id === undefined) {
        throw "id is missing";
      }
      if (req.files && req.files.url) {
        body.url = await app.upload_pic_with_await(req.files.url);
        delete req.files.url.data;
        body.metadata = JSON.stringify(req.files.url);
      }
      if (req.files && req.files.profile) {
        body.profile = await app.upload_pic_with_await(req.files.profile);
      }
      return await DB.save(body.table, body);
    } catch (err) {
      next(err);
    }
  }
  async deleteData(req, res, next) {
    const { body } = req;
    try {
      if (body.id === undefined) {
        throw "id is missing";
      }
      return await DB.first(
        "delete from " + body.table + " where id =" + body.id
      );
    } catch (err) {
      next(err);
    }
  }

  islogin(req, res) {
    return true;
  }

  async dashboard() {
    const totals = {
      posts: 0,
      users: 0,
      totalAmount: 0
    };

    totals.posts = await DB.first("select count(*) as total from posts");
    totals.users = await DB.first("select count(*) as total from users");
    totals.totalAmount = await DB.first(
      "select IFNull(sum(amount),0) as total from users_posts"
    );
    totals.posts = totals.posts[0].total;
    totals.users = totals.users[0].total;
    totals.totalAmount = totals.totalAmount[0].total;
    return totals;
  }
  async transaction(req) {
    let offset = req.params.offset !== undefined ? req.params.offset : 1;
    let limit = req.params.limit !== undefined ? req.params.limit : 20;
    offset = (offset - 1) * limit;
    let conditions = "";
    if (req.query.q.length > 0) {
      conditions +=
        " where posts.title like '%" +
        req.query.q +
        "%' or posts.description like '% " +
        req.query.q +
        "%' or users.name like '%" +
        req.query.q +
        "%' or users.email like '%" +
        req.query.q +
        "%'";
    }
    let query =
      "select posts.*, users_posts.*, users.name as username, users.email as email, users.profile as profile";
    query += " from users_posts";
    query += " join posts on (posts.id = users_posts.post_id)";
    query += " join users on (users.id = users_posts.user_id)" + conditions;
    query += " order by users_posts.id desc limit " + offset + " ," + limit;
    return this.addUrl(await DB.first(query), ["profile", "url"]);
  }
}

module.exports = adminController;
