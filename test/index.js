var omf = require('./../');

var app = require('./app/app');

omf.test(app, function(app) {

  app.get('/', function(response) {
    response.has.statusCode(200);
    response.is.html();
    response.has.body('O hai!');
  });

});
