const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const process = require("process");
const useragent = require('express-useragent');
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const apiRouter = require("./routes/apis");

var app = express();

app.use(useragent.express());
// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// file upload file
app.use(
  fileUpload({
    createParentPath: true
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../build")));
app.get('/admin', (req, res) => {
  console.log('path.resolve(__dirname)', path.resolve(__dirname, '../build/index.html'));
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/apis/v1/", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// set path root path
global.appRoot = path.resolve(__dirname);
// error handler
console.log(appRoot);
app.use(function(err, req, res) {
  // set locals, only providing error in development
  console.log(err,"pankaj check");
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  if (req.accepts("json")) {
    res.status(404).json({
      code: 404,
      message: "not found"
    });
  }
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
   // process.exit(1);
  });
module.exports = app;
