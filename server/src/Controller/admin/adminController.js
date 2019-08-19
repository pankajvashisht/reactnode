const Db = require("../../../libary/sqlBulider")
const app = require("../../../libary/CommanMethod");
let DB = new Db;

class adminController {
    constructor(){
        this.limit = 20;
        this.offset =1;
    }
    async login(req,res){
        const {body} = req;
        try{
            let login_details = await DB.find("admins", "first", {
                conditions: {
                  email: body.email
                },
              });
              if (login_details) {
                if (app.createHash(body.password) != login_details.password)
                  throw "Wrong Email or password";
                delete login_details.password;
                let token = await app.UserToken(login_details.id, req);
                console.log(token);
                await DB.save("admins", {
                  id: login_details.id,
                  token: token
                });
                login_details.token = token;
                return app.success(res, {
                  message: "User login successfully",
                  data: login_details
                });
              }
              throw "Wrong Email or password";
        }catch(err){
            app.error(res, err);
        }
    }
    async allUser(req){
        let offset = (req.params.offset != undefined)?req.params.offset:1;
        let limit = (req.params.limit != undefined)?req.params.limit:20;
        offset = (offset -1) * limit;
        let conditions = '';
        if (req.query.q !=undefined ) {
            conditions+=" where name like '% "+req.query.q+" %' or email like '% "+req.query.q+" %'";
        }   
        let query = "select * from users "+conditions+" order by id desc limit "+offset+" , "+limit;
        return await DB.first(query);
    }

    async allPost(req){
        let offset = (req.params.offset != undefined)?req.params.offset:1;
        let limit = (req.params.limit != undefined)?req.params.limit:20;
        offset = (offset -1) * limit;
        let conditions = '';
        if (req.query.q !=undefined ) {
            conditions+=" where title like '% "+req.query.q+" %' or description like '% "+req.query.q+" %'";
        }   
        let query = "select * from posts "+conditions+" order by id desc limit "+offset+" , "+limit;
        return await DB.first(query);
    }

    async addPost(req,res,next){
        const {body} = req;
        try{
            if (req.files && req.files.url) {
                body.url = await app.upload_pic_with_await(
                  req.files.url
                );
                body.metadata = JSON.stringify(req.files.url);
              }
          return await DB.save('posts',body);    
        }catch(err){
            next(err);
        }
    }
    async addUser(req,res,next){
        const {body} = req;
        try{
            if (req.files && req.files.profile) {
                body.profile = await app.upload_pic_with_await(
                  req.files.profile                
                  );
              }
          return await DB.save('users',body);    
        }catch(err){
            next(err);
        }
    }

    async updateData(req,res,next){
        const {body} = req;
        try{
            if(body.id == undefined){
                throw "id is missing";
            }
            if (req.files && req.files.url) {
                body.url = await app.upload_pic_with_await(
                  req.files.url
                );
                body.metadata = JSON.stringify(req.files.url);
            }
            if (req.files && req.files.profile) {
                body.profile = await app.upload_pic_with_await(
                  req.files.profile                
                  );
            }
          return await DB.save(body.table, body);    
        }catch(err){
            next(err);
        }
    }
    async deleteData(req,res,next){
        const {body} = req;
        try{
            if(body.id == undefined){
                throw "id is missing";
            }
          return await DB.first("delete from "+body.table+" where id ="+body.id);    
        }catch(err){
            next(err);
        }
    }

}

module.exports = adminController;