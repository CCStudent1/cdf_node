var express = require('express');
var router = express.Router();
var formsFolder = '../views/forms/'

var expressHandlebars =  require('express-handlebars');
var handlebars = expressHandlebars.create({});

handlebars.handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

handlebars.handlebars.registerHelper('ifNotEquals', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render( formsFolder + 'start', { layout: 'form'});
});

router.post('/start', function(req, res, next) {
  res.render(formsFolder + 'start', { layout: 'form'});
});

router.post('/init', function(req, res, next) {
  let counties = ['--', 'Alameda', 'San Francisco', 'Los Angeles']
  let form_response = JSON.parse(JSON.stringify(req.body));
  console.log(form_response)
  res.render(formsFolder + 'init', { layout: 'form', form_response, counties});
});

router.post('/income', function(req, res, next) {
  form_response = JSON.parse(JSON.stringify(req.body));
  res.render(formsFolder + 'income', { layout: 'form', form_response});
});

router.post('/children_dependents', function(req, res, next) {
  form_response = JSON.parse(JSON.stringify(req.body));
  res.render(formsFolder + 'children_dependents', { layout: 'form', form_response});

});

router.post('/children', function(req, res, next) {
  // var form = req.body
  // if (form) {
  //   res.render(formsFolder + 'children', { layout: 'form'});
  // }
  // res.redirect('other_dependents')
  res.render(formsFolder + 'other_dependents', { layout: 'form', form_response});
});

router.post('/other_dependents', function(req, res, next) {
  form_response = JSON.parse(JSON.stringify(req.body));
  res.render(formsFolder + 'other_dependents', { layout: 'form', form_response});
});

router.post('/monthly_expenses', function(req, res, next) {
  form_response = JSON.parse(JSON.stringify(req.body));
  res.render(formsFolder + 'monthly_expenses', { layout: 'form', form_response});
});

module.exports = router;
