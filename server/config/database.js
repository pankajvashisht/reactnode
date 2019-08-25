require("dotenv").config();
const database = {
  default: process.env.DATABASE || "mysql",
  mysql: {
    host: "localhost",
    user: "root",
    password: "",
    database: "tiger2",
    connectionLimit: 50
  }
};

module.exports = database;
