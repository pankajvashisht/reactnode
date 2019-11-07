require("dotenv").config();

const path = require("path");
const config = {
  port: process.env.port || 4000,
  root_path: path.resolve(__dirname)
};

module.exports = config;
