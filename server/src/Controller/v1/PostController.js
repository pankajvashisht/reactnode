const ApiController = require("./ApiController");
const app = require("../../../libary/CommanMethod");
const Db = require("../../../libary/sqlBulider");
let apis = new ApiController();
let DB = new Db();
module.exports = {
  getPost: async (req, res) => {
    let required = {
      user_id: req.body.user_id,
      offset: req.params.offset,
      post_type: req.query.post_type
    };
    try {
      const request_data = await apis.vaildation(required, {});
      let offset = (request_data.offset - 1) * 20;
      let query = "select posts.*, ";
      query +=
        "(select count(*) from users_posts where user_id = " +
        request_data.user_id +
        " and post_id = posts.id) as is_buy from posts where status = 1 and post_type = " +
        request_data.post_type;
      query += " order by posts.id desc limit " + offset + " , 20";
      let result = await DB.first(query);
      result.forEach((value, key) => {
        result[key].url = app.ImageUrl(value.url);
        if (value.audio_sample.length > 0) {
          result[key].audio_sample = app.ImageUrl(value.audio_sample);
        }
        if (value.audio.length > 0) {
          result[key].audio = app.ImageUrl(value.audio);
        }
        if (value.cover_pic.length > 0) {
          result[key].cover_pic = app.ImageUrl(value.cover_pic);
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
  homePost: async (req, res) => {
    let required = {
      user_id: req.body.user_id,
      offset: req.params.offset
    };
    try {
      const request_data = await apis.vaildation(required, {});
      let offset = (request_data.offset - 1) * 20;
      return app.success(res, {
        message: " Posts ",
        data: {
          pdf: await getPostBytype(1, request_data.user_id, offset),
          audio: await getPostBytype(2, request_data.user_id, offset),
          pdf_audio: await getPostBytype(3, request_data.user_id, offset)
        }
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
        if (value.sample_audio.length > 0) {
          result[key].sample_audio = app.ImageUrl(value.sample_audio);
        }
        if (value.audio.length > 0) {
          result[key].audio = app.ImageUrl(value.audio);
        }
        if (value.cover_pic.length > 0) {
          result[key].cover_pic = app.ImageUrl(value.cover_pic);
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
    if (value.audio_sample.length > 0) {
      result[key].audio_sample = app.ImageUrl(value.audio_sample);
    }
    if (value.audio.length > 0) {
      result[key].audio = app.ImageUrl(value.audio);
    }
    if (value.cover_pic.length > 0) {
      result[key].cover_pic = app.ImageUrl(value.cover_pic);
    }
  });
  return result[0];
};

const getPostBytype = async (type, user_id, offset) => {
  try {
    var query = "select posts.*, ";
    query +=
      "(select count(*) from users_posts where user_id = " +
      user_id +
      " and post_id = posts.id) as is_buy from posts where status = 1 and post_type =  " +
      type;
    query += " order by posts.id desc limit " + offset + " , 10";
    let pdf = await DB.first(query);
    pdf.forEach((value, key) => {
      pdf[key].url = app.ImageUrl(value.url);
      if (value.audio_sample.length > 0) {
        pdf[key].audio_sample = app.ImageUrl(value.audio_sample);
      }
      if (value.audio.length > 0) {
        pdf[key].audio = app.ImageUrl(value.audio);
      }
      if (value.cover_pic.length > 0) {
        pdf[key].cover_pic = app.ImageUrl(value.cover_pic);
      }
    });
    return pdf;
  } catch (error) {
    throw error;
  }
};
