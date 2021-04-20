var express = require('express');
var router = express.Router();
var formsFolder = '../views/forms/'

/* GET users listing. */
router.get('/', function(req, res, next) {
   // res.sendFile('cdf-form.html', { root: __dirname });
  // res.redirect('/form/init');
  console.log(formsFolder)
  res.render( formsFolder + 'start', { layout: 'form'});
});

router.post('/start', function(req, res, next) {
  res.render(formsFolder + 'start', { layout: 'form'});
});

router.post('/init', function(req, res, next) {
  res.render(formsFolder + 'init', { layout: 'form'});
});

router.post('/income', function(req, res, next) {
  res.render(formsFolder + 'income', { layout: 'form'});
});

router.post('/children_dependents', function(req, res, next) {
  res.render(formsFolder + 'children_dependents', { layout: 'form'});

});

router.post('/children', function(req, res, next) {
  // var form = req.body
  // if (form) {
  //   res.render(formsFolder + 'children', { layout: 'form'});
  // }
  // res.redirect('other_dependents')
  res.render(formsFolder + 'other_dependents', { layout: 'form'});
});

router.post('/other_dependents', function(req, res, next) {
  res.render(formsFolder + 'other_dependents', { layout: 'form'});
});

router.post('/monthly_expenses', function(req, res, next) {
  res.render(formsFolder + 'monthly_expenses', { layout: 'form'});
});

module.exports = router;
