const app = require("./CommanMethod");
const response = fn => async (req, res) => {
  try {
    const data = await fn(req, res);
    res.status(200).send({
      success: true,
      data
    });
  } catch (error) {
    return app.error(res, error);
  }
};
module.exports = response;
