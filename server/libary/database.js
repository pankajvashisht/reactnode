const database = require("../config/database");
const mysql = require("mysql");
class Database {
  constructor() {
    this.db_connect = mysql.createPool(database[database.default]);
    this.db_connect.getConnection(function(err) {
      try {
        if (err) throw err;
        console.log("Connected!");
      } catch (err) {
        console.log(err);
      }
    });
    this.connection = this.db_connect;
  }
}

module.exports = Database;
