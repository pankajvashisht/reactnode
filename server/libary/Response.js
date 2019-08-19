const response = fn => async (req, res, next) => {
  try {
    const data  = await fn(req, res);
    res.status(200).send({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
module.exports = response;
