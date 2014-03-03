//require our client helper
var omf = require('./../');

//initialize our test client
omf('http://google.com', function(app) {
  app.get('/', function(response) {
    response.has.statusCode(200);
    response.is.html();
    response.has.body("I'm Feeling Lucky");
  });
});
