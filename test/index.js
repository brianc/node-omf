var omf = require('./../');

var app = require('./app/app');

omf(app, function(app) {

  app.get('/', function(response) {
    response.has.statusCode(200);
    response.is.html();
    response.has.body('O hai!');
  });

  app.get('/index.css', function(res) {
    res.has.statusCode(200);
    res.is.css();
  });

  app.get('/index.js', function(res) {
    res.has.statusCode(200);
    res.is.javascript();
  });

});
