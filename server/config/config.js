require("dotenv").config();
const path = require("path");
const config = {
  port: process.env.port || 3000,
  root_path: path.resolve(__dirname)
};

module.exports = config;
