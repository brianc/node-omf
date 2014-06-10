var assert = require('assert');

var omf = require('./../');
var app = require('./app/app');

omf(app, function(app) {

  app.get('/', function(response) {
    response.has.statusCode(200);
    response.is.html();
    response.has.body('O hai!');
  });

  app.get('/');

  app.get('/', 200);

  describe('using request directly', function() {
    before(function(done) {
      var self = this;
      app.request.get(app.url('/'), function(err, result) {
        if(err) return done(err);
        self.response = result;
        done();
      });
    })
    app.response.has.statusCode(200);
  });

  describe('with dynamic builder', function() {
    var build = function(status) {
      return function() {
        return {
          name: 'dynamicUrl',
          path: '/status/' + status
        }
      }
    };
    app.get(build(202), function(res) {
      res.has.statusCode(202);
    });
  });

  describe('with async dynamic builder', function() {
    return;
    var build = function(status) {
      return function(cb) {
        process.nextTick(function() {
          cb(null, {
            name: 'dynamicUrl',
            path: '/status/' + status
          });
        });
      }
    };
    app.get(build(202), function(res) {
      res.has.statusCode(202);
    });
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

  describe('put', function() {
    app.put('/data', 201);
  });

  describe('del (delete)', function() {
    app.del('/data', 403);
  });

  describe('delete', function() {
    app.delete('/data', 403);
  });



  describe('cookes', function() {
    app.get('/cookie', function(res) {
      res.has.statusCode(200);
      res.has.body('no');
    });
    app.get('/cookie', function(res) {
      res.has.statusCode(200);
      res.has.body('yes');
    });
    app.clearCookies();
    app.get('/cookie', function(res) {
      res.has.statusCode(200);
      res.has.body('no');
    });
    app.get('/cookie', function(res) {
      res.has.statusCode(200);
      res.has.body('yes');
    });
  });

  describe('basic auth', function() {
    var auth = {
      user: 'user',
      pass: 'pass'
    }
    app.get('/basic/test', { auth: auth }, function(res) {
      res.has.statusCode(204)
    })
  })

  describe('json response', function() {
    app.post('/data', {json: {name: 'brian'}}, function(res) {
      res.has.statusCode(200)

      it('has json', function() {
        assert(this.body, 'should set json response if response was json')
        this.body.happy = true
      })

      var called = false

      res.has.data({
        user: function(value) {
          called = true
          assert.equal(value, 'brian')
        },
        happy: true
      })

      it('should have called check user function', function() {
        assert(called)
      })
    })
  })

});
