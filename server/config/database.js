require("dotenv").config();
const database = {
  default: process.env.DATABASE || "mysql",
  mysql: {
    host: "localhost",
    user: "tiger",
    password: "root@admin",
    database: "tiger2",
    connectionLimit: 50
  }
};

module.exports = database;
