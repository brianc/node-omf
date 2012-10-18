//require our client helper
var client = require('./../');

//initialize our test client
client.test('http://bmc.io', function(app) {

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
