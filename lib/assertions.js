var assert = require('assert');
    var mochaCheck = require('mocha-check')

var assertions = {
  statusCode: function(code) {
    it('has statusCode ' + code, function() {
      assert.equal(this.response.statusCode, code);
    });
  },
  header: function(name, val) {
    it('has header "'+name+'" with value "'+val+'"', function() {
      assert(this.response.headers[name], 'expected header "'+name+' to exist"');
      assert(this.response.headers[name].indexOf(val) > -1, 'expected header "'+name+'" to contain "'+val+'" but it is "'+this.response.headers[name]+'"')
    });
  },
  body: function(content) {
    it('has body content "'+content+'"', function() {
      assert(this.response.body.indexOf(content) > -1);
    });
  },
  ok: function() {
    it('has 2xx success statusCode', function() {
      assert(this.response.statusCode > 199, "expected statusCode of 2xx but recieved " + this.response.statusCode);
      assert(this.response.statusCode < 300, "expected statusCode of 2xx but recieved " + this.response.statusCode);
    })
  }
};
assertions.contentType = assertions.header.bind(assertions, 'content-type');
assertions.css = assertions.contentType.bind(assertions, 'text/css');
assertions.html = assertions.contentType.bind(assertions, 'text/html');
assertions.javascript = assertions.contentType.bind(assertions, 'application/javascript');
assertions.json = assertions.contentType.bind(assertions, 'application/json');
assertions.have = assertions;
assertions.be = assertions;
assertions.has = assertions;
assertions.is = assertions;
assertions.assertions = assertions;

assertions.data = function(expected) {
  mochaCheck('body', expected)
}

module.exports = assertions;
