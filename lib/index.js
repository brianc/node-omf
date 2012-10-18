var request = require('request');

var Client = function(app) {
  this.app = app;
  this.port = 3212;
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

Client.prototype.stop = function(cb) {
  if(this.isRemote()) return cb();
  this.server.close(cb);
};

Client.prototype.request = function(path, options, cb) {
  if(typeof options === 'function') {
    cb = options;
    options = {};
  }
  var uri = this.isRemote() ? this.app : "http://localhost:" + this.port;
  options.uri = uri + path;
  return request(options, function(err, res, body) {
    if(err) return cb(err);
    res.body = body;
    cb(null, res);
  });
};

Client.prototype.get = function(path, cb) {
  var client = this;
  describe('GET ' + path, function() {
    before(function(done) {
      var self = this;
      client.request(path, function(err, res) {
        self.response = res;
        done(err);
      });
    });
    cb(require(__dirname + '/assertions'));
  });
};

var test = function(app, cb) {
  var client = new Client(app);
  describe('site', function() {
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
