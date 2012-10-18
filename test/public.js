//require our client helper
var omf = require('./../');

//initialize our test client
omf('http://bmc.io', function(app) {

  app.get('/', function(response) {
    response.has.statusCode(200);
    response.is.html();
    response.has.body('O hai!');
  });
  
  app.get('/index.css', function(response) {
    response.has.statusCode(200);
    response.is.css();
  });

});
