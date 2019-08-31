const ApiController = require("./ApiController");
const app = require("../../../libary/CommanMethod");
const Db = require("../../../libary/sqlBulider");
let apis = new ApiController();
let DB = new Db();
module.exports = {
  getPost: async (req, res) => {
    let required = {
      user_id: req.body.user_id,
      offset: req.params.offset
    };
    try {
      let request_data = await apis.vaildation(required, {});
      let offset = (request_data.offset - 1) * 20;
      let query = "select posts.*, ";
      query +=
        "(select count(*) from users_posts where user_id = " +
        request_data.user_id +
        " and post_id = posts.id) as is_buy from posts where status = 1";
      query += " order by posts.id desc limit " + offset + " , 20";
      let result = await DB.first(query);
      result.forEach((value, key) => {
        result[key].url = app.ImageUrl(value.url);
        if (value.sample_audio.length > 0) {
          result[key].sample_audio = app.ImageUrl(value.sample_audio);
        }
        if (value.audio.length > 0) {
          result[key].audio = app.ImageUrl(value.audio);
        }
      });
      return app.success(res, {
        message: " Posts ",
        data: result
      });
    } catch (err) {
      return app.error(res, err);
    }
  },
  myposts: async (req, res) => {
    let required = {
      user_id: req.body.user_id,
      offset: req.params.offset
    };
    try {
      let request_data = await apis.vaildation(required, {});
      let offset = (request_data.offset - 1) * 20;
      let query = "select posts.*, users_posts.*, ";
      query +=
        "(select count(*) from users_posts where user_id = " +
        request_data.user_id +
        " and post_id = posts.id) as is_buy from users_posts";
      query += " join posts on (posts.id = users_posts.post_id)";
      query +=
        " where posts.status = 1 and users_posts.status =1 and users_posts.user_id=" +
        request_data.user_id;
      query += " order by posts.id desc limit " + offset + " , 20";
      let result = await DB.first(query);
      result.forEach((value, key) => {
        result[key].url = app.ImageUrl(value.default_url);
      });
      return app.success(res, {
        message: " Posts ",
        data: result
      });
    } catch (err) {
      return app.error(res, err);
    }
  },
  buyPost: async (req, res) => {
    let required = {
      user_id: req.body.user_id,
      post_id: req.body.post_id,
      payment_type: req.body.payment_type,
      payment_details: req.body.payment_details,
      amount: req.body.amount,
      status: req.body.status
    };
    try {
      let request_data = await apis.vaildation(required);
      let insertId = await DB.save("users_posts", request_data);
      return app.success(res, {
        message: "buy successfully",
        data: await postDetails(insertId)
      });
    } catch (err) {
      return app.error(res, err);
    }
  }
};

const postDetails = async function(id) {
  let query = "select  posts.*, 1 as is_buy from ";
  query +=
    "posts join users_posts on (posts.id = users_posts.post_id) where posts.id = " +
    id +
    " limit 1";
  let result = await DB.first(query);
  result.forEach((value, key) => {
    result[key].url = app.ImageUrl(value.url);
  });
  return result[0];
};
