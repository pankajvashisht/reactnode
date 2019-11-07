var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get('/share/:id', function(req, res, next) {
  res.render('share', { id: req.params.id });
});

module.exports = router;
