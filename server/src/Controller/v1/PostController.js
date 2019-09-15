const ApiController = require('./ApiController');
const app = require('../../../libary/CommanMethod');
const Db = require('../../../libary/sqlBulider');
let apis = new ApiController();
let DB = new Db();
module.exports = {
  getPost: async (req, res) => {
    let required = {
      user_id: req.body.user_id,
      offset: req.params.offset,
      post_type: req.query.post_type,
    };
    try {
      const request_data = await apis.vaildation(required, {});
      let offset = (request_data.offset - 1) * 20;
      let query = 'select posts.*, ';
      query +=
        '(select count(*) from users_posts where user_id = ' +
        request_data.user_id +
        ' and post_id = posts.id) as is_buy,IFNULL((select count(*) from favourites where user_id = ' +
        request_data.user_id +
        ' and post_id = posts.id),0) as is_fav from posts where status = 1 and post_type = ' +
        request_data.post_type;
      query += ' order by posts.id desc limit ' + offset + ' , 20';
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
        message: 'Posts',
        data: result,
      });
    } catch (err) {
      return app.error(res, err);
    }
  },
  myPost: async (req, res) => {
    let required = {
      user_id: req.body.user_id,
      offset: req.params.offset,
    };
    try {
      const request_data = await apis.vaildation(required, {});
      let offset = (request_data.offset - 1) * 20;
      let query = 'select posts.*, ';
      query +=
        '(select count(*) from users_posts where user_id = ' +
        request_data.user_id +
        ' and post_id = posts.id) as is_buy,IFNULL((select count(*) from favourites where user_id = ' +
        request_data.user_id +
        ' and post_id = posts.id),0) as is_fav from posts where status = 1 and user_id = ' +
        request_data.user_id;
      query += ' order by posts.id desc limit ' + offset + ' , 20';
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
        message: 'Posts',
        data: result,
      });
    } catch (err) {
      return app.error(res, err);
    }
  },
  addComment: async (req, res) => {
    let required = {
      user_id: req.body.user_id,
      post_id: req.body.post_id,
      comment: req.body.comment,
    };
    try {
      const request_data = await apis.vaildation(required, {});
      request_data.id = await DB.save('post_comments', request_data);
      return app.success(res, {
        message: 'Comment added successfully',
        data: request_data,
      });
    } catch (err) {
      return app.error(res, err);
    }
  },
  getComments: async (req, res) => {
    let required = {
      post_id: req.params.post_id,
      offset: req.params.offset,
      limit: req.params.limit,
    };
    try {
      const request_data = await apis.vaildation(required, {});
      let offset = (request_data.offset - 1) * request_data.limit;
      const query =
        'select pc.*,u.name,u.email,u.profile from post_comments as pc join users as u on (pc.user_id=u.id) where post_id = ' +
        request_data.post_id +
        ' order by pc.id desc limit ' +
        offset +
        ', ' +
        request_data.limit;
      const data = await DB.first(query);
      data.forEach((value, key) => {
        if (value.profile.length > 0) {
          data[key].profile = app.ImageUrl(value.profile);
        }
      });
      return app.success(res, {
        message: 'comment list',
        data,
      });
    } catch (err) {
      return app.error(res, err);
    }
  },
  async addPost(req) {
    const required = {
      user_id: req.body.user_id,
      post_type: req.body.post_type,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      status: 1,
    };
    try {
      const request_data = await apis.vaildation(required, {});
      if (req.files && req.files.url) {
        request_data.url = await app.upload_pic_with_await(req.files.url);
        delete req.files.url.data;
        request_data.metadata = JSON.stringify(req.files.url);
      }
      if (req.files && req.files.audio) {
        request_data.audio = await app.upload_pic_with_await(req.files.audio);
      }
      if (req.files && req.files.cover_pic) {
        request_data.cover_pic = await app.upload_pic_with_await(
          req.files.cover_pic,
        );
      }
      if (req.files && req.files.sample_audio) {
        request_data.audio_sample = await app.upload_pic_with_await(
          req.files.sample_audio,
        );
      }
      request_data.id = await DB.save('posts', request_data);
      return app.success(res, {
        message: 'post addedd successfully',
        data: request_data,
      });
    } catch (err) {
      return app.error(res, err);
    }
  },
  homePost: async (req, res) => {
    let required = {
      user_id: req.body.user_id,
      offset: req.params.offset,
    };
    try {
      const request_data = await apis.vaildation(required, {});
      let offset = (request_data.offset - 1) * 20;
      return app.success(res, {
        message: ' Posts ',
        data: {
          pdf: await getPostBytype(1, request_data.user_id, offset),
          audio: await getPostBytype(2, request_data.user_id, offset),
          pdf_audio: await getPostBytype(3, request_data.user_id, offset),
        },
      });
    } catch (err) {
      return app.error(res, err);
    }
  },
  favourites: async (req, res) => {
    let required = {
      user_id: req.body.user_id,
      post_id: req.body.post_id,
    };
    try {
      const request_data = await apis.vaildation(required, {});
      const is_fav = await DB.find('favourites', 'all', {
        conditions: {
          post_id: request_data.post_id,
          user_id: request_data.user_id,
        },
      });
      let message = '';
      if (is_fav.length > 0) {
        let query = 'delete from favourites where id = ' + is_fav[0].id;
        await DB.first(query);
        message = 'Post Unfav successfully';
      } else {
        await DB.save('favourites', request_data);
        message = 'Post fav successfully';
      }
      return app.success(res, {
        message: message,
        data: [],
      });
    } catch (err) {
      return app.error(res, err);
    }
  },
  myposts: async (req, res) => {
    let required = {
      user_id: req.body.user_id,
      offset: req.params.offset,
    };
    try {
      let request_data = await apis.vaildation(required, {});
      let offset = (request_data.offset - 1) * 20;
      let query = 'select posts.*, users_posts.*, ';
      query +=
        '(select count(*) from users_posts where user_id = ' +
        request_data.user_id +
        ' and post_id = posts.id) as is_buy,IFNULL((select count(*) from favourites where user_id = ' +
        request_data.user_id +
        ' and post_id = posts.id),0) as is_fav from users_posts';
      query += ' join posts on (posts.id = users_posts.post_id)';
      query +=
        ' where posts.status = 1 and users_posts.status =1 and users_posts.user_id=' +
        request_data.user_id;
      query += ' order by posts.id desc limit ' + offset + ' , 20';
      let result = await DB.first(query);
      result.forEach((value, key) => {
        result[key].url = app.ImageUrl(value.default_url);
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
        message: ' Posts ',
        data: result,
      });
    } catch (err) {
      return app.error(res, err);
    }
  },
  favPost: async (req, res) => {
    let required = {
      user_id: req.body.user_id,
      offset: req.params.offset,
      post_type: req.query.post_type || 1,
    };
    try {
      let request_data = await apis.vaildation(required, {});
      let offset = (request_data.offset - 1) * 20;
      let query = 'select posts.*, ';
      query +=
        '(select count(*) from users_posts where user_id = ' +
        request_data.user_id +
        ' and post_id = posts.id) as is_buy,IFNULL((select count(*) from favourites where user_id = ' +
        request_data.user_id +
        ' and post_id = posts.id),0) as is_fav from favourites';
      query += ' join posts on (posts.id = favourites.post_id)';
      query +=
        ' where posts.status = 1  and favourites.user_id=' +
        request_data.user_id +
        ' and posts.post_type = ' +
        request_data.post_type;
      query += ' order by posts.id desc limit ' + offset + ' , 20';
      let result = await DB.first(query);
      result.forEach((value, key) => {
        result[key].url = app.ImageUrl(value.default_url);
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
        message: 'fav Posts ',
        data: result,
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
      status: req.body.status,
    };
    try {
      let request_data = await apis.vaildation(required);
      let insertId = await DB.save('users_posts', request_data);
      return app.success(res, {
        message: 'buy successfully',
        data: await postDetails(insertId),
      });
    } catch (err) {
      return app.error(res, err);
    }
  },
};

const postDetails = async function(id) {
  let query = 'select  posts.*, 1 as is_buy from ';
  query +=
    'posts join users_posts on (posts.id = users_posts.post_id) where posts.id = ' +
    id +
    ' limit 1';
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
    var query = 'select posts.*, ';
    query +=
      '(select count(*) from users_posts where user_id = ' +
      user_id +
      ' and post_id = posts.id) as is_buy, IFNULL((select count(*) from favourites where user_id = ' +
      user_id +
      ' and post_id = posts.id), 0 ) as is_fav from posts where status = 1 and post_type =  ' +
      type;
    query += ' order by posts.id desc limit ' + offset + ' , 10';
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
