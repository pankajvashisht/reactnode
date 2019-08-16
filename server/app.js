const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const process = require("process");
const fs = require("fs");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const apiRouter = require("./routes/apis");

var app = express();

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
app.use(express.static(path.join(__dirname, "../build")));
app.get('/admin', (req, res) => {
  console.log('path.resolve(__dirname)', path.resolve(__dirname, '../build/index.html'));
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/apis/v1/", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// set path root path
global.appRoot = path.resolve(__dirname);
// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
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

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`
  );
});



module.exports = app;
