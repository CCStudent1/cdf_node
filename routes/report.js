var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  queryStr = req.query
  console.log(queryStr)
  res.sendFile('charts.html', { root: __dirname });
  //res.render('charts.html')
  //res.render(__dirname + "/views/charts.html", {name:queryStr});
});

module.exports = router;
