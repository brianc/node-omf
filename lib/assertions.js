var assert = require('assert');

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

module.exports = assertions;
