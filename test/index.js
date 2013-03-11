var assert = require('assert');

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

  app.get('/status/200', function(res) {
    res.is.ok();
  });

  app.get('/status/201', function(res) {
    res.is.ok();
  });

  app.get('/status/299', function(res) {
    res.is.ok()
  });

  app.get('/index.js', function(res) {
    res.has.statusCode(200);
    res.is.javascript();
  });

  app.get('/data', function(res) {
    res.has.statusCode(404);
  });

  app.post('/data', {json: {name: 'brian'}}, function(res) {
    res.has.statusCode(200);
    res.is.json();

    it('returns valid json', function() {
      assert.equal(this.response.body.user, 'brian');
    });
  });

  describe('invalid post', function() {
    app.post('/data', {json: {name: 'Aaron'}}, function(res) {
      res.has.statusCode(500);

      it('returns error json', function() {
        assert.strictEqual(this.response.body.pwnd, true);
      });
    });
  });

});
