const error = (res, err) => {
  let code = typeof err === "object" ? err.code : 403;
  let message = typeof err === "object" ? err.message : err;
  res.status(code).json({
    success: false,
    error_message: message,
    code: code,
    body: []
  });
};
const response = () => {};

module.exports = error;
