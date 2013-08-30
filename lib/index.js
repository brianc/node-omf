var Client = function(app, request) {
  this.app = app;
  this.request = request;
  this.port = 3212;
  this.jar = request.jar();
  this.name = this.isRemote() ? this.app : 'localhost:' + this.port;
  if(this.isRemote()) return;
  this.server = require('http').createServer(this.app);
};

Client.prototype.isRemote = function() {
  return typeof this.app === 'string';
}

Client.prototype.start = function(cb) {
  if(this.isRemote()) return cb();
  this.server.listen(this.port, cb);
};

Client.prototype.clearCookies = function() {
  describe('cookies', function() {
    it('clear', function() {
      this.jar = this.request.jar();
    }.bind(this))
  }.bind(this))
};

Client.prototype.stop = function(cb) {
  if(this.isRemote()) return cb();
  this.server.close(cb);
};

//create a fully qualified url & append the path segment
Client.prototype.url = function(path) {
  var uri = this.isRemote() ? this.app : "http://localhost:" + this.port;
  return uri + path;
};

Client.prototype._request = function(path, options, cb) {
  if(typeof options === 'function') {
    cb = options;
    options = {};
  }
  if(typeof path === 'function') {
    options = path();
    options.uri = this.url(options.path);
  } else {
    options.uri = this.url(path);
  }
  options.jar = options.jar || this.jar;
  return this.request(options, function(err, res, body) {
    if(err) return cb(err);
    res.body = body;
    cb(null, res);
  });
};

Client.prototype.req = function(method, path, options, cb) {
  var o = options;
  if(typeof options === 'undefined') {
    o = {};
  }
  if(typeof options === 'number') {
    cb = function(res) {
      res.has.statusCode(options);
    }
    o = {};
  }
  if(typeof options === 'function') {
    cb = options;
    o = {};
  }
  o.method = method;
  var name = path;
  if(typeof name === 'function') {
    name = '<dynamic>';
  }
  var client = this;
  describe(method + (method.length == 3 ? '  ' :  ' ') + name, function() {
    if(!cb) {
      cb = function(res) {
        res.is.ok();
      }
    }
    it('responds', function(done) {
      var self = this;
      client._request(path, o, function(err, res) {
        self.response = res;
        done(err);
      });
    })
    cb(require(__dirname + '/assertions'));
  });
};

Client.prototype.get = function(path, options, cb) {
  this.req('GET', path, options, cb);
};

Client.prototype.post = function(path, options, cb) {
  this.req('POST', path, options, cb);
};

Client.prototype.put = function(path, options, cb) {
  this.req('PUT', path, options, cb);
};

Client.prototype.del = function(path, options, cb) {
  this.req('DELETE', path, options, cb);
};

Client.prototype.response = require(__dirname + '/assertions');

var test = function(app, cb) {
  var request = require('request');
  var client = new Client(app, request);
  describe(client.name, function() {
    before(function(done) {
      client.start(done);
    });
    after(function(done) {
      client.stop(done);
    });
    cb(client);
  });
};

module.exports = test;
