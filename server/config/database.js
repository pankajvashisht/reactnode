require("dotenv").config();
const database = {
  default: process.env.DATABASE || "mysql",
  mysql: {
    host: "localhost",
    user: "ucreate",
    password: "ucreate",
    database: "reactnode",
    connectionLimit: 50
  }
};

module.exports = database;
