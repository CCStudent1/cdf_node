var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.sendFile('cdf-form.html', { root: __dirname });
  res.render('form', { error : false })
});

module.exports = router;
