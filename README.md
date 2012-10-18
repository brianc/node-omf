# ORANGE MOCHA FRAPPUCCINO!!!11

A little dsl to build http verification tests quickly on top of the [mocha](https://github.com/visionmedia/mocha) test framework.

## install

```
npm install omf
```

## use

```js
var omf = require('omf');

var app = require(/*require your express app or http server listener here*/);

omf(app, function(client) {

  client.get('/', function(response) {
    response.has.statusCode(200);
    response.is.html();
    response.has.body('O hai!');
  });

  client.get('/index.js', function(response) {
    response.has.statusCode(200);
    response.has.header('content-type', 'application/javascript');
  });

});
```

Instead of passing in an express or http server listener as the first parameter, we can pass in the base url of any public website, and all the tests can still run.  This way you can swap out your development app for one in production and use the same http tests as a verification tool for your live site.

```js
var omf = require('omf');
var assert = require('assert');

omf('https://github.com', function(client) {
  client.get('/brianc/node-omf', function(response){
    response.has.statusCode(200);
    response.has.body('ORANGE MOCHA FRAPPUCCINO');

    //the full response is available to any custom tests:
    it('has ETag header', function() {
      assert(this.response.headers['etag']).ok();
    });
  });
});
```

ORANGE MOCHA FRAPPUCCINO just uses a tiny bit of meta-programmy-bla-bla to reduce the boiler plate in set up & tear down of http tests...but you still have the entire mocha framework at your disposal.  For example, you can still nest sub-contexts, do more setup/teardown, or whatever!

```js
var omf = require('omf');
var assert = require('assert');

omf('https://github.com', function(client) {
  describe('when not signed in', function() {
    before(function(done) {
      process.nextTick(function() {
        //some sign out logic maybe?
        done();
      });
    });
    
    client.get('/brianc/node-omf', function(response) {
      response.has.statusCode(200);
    });
  });
});
```

Also, the requests are all sent using the [request](https://github.com/mikeal/request) library.  Anything you pass as the _optional_ 2nd parameter will be passed straight into the request module.

```js
omf('https://some-awesome-json-web-service.com', function(client) {
  describe('with json request', function() {
    var options = { json: true };

    get('/user1.json', options, function(res) {
      res.has.statusCode(200);
    });
  });

  describe('with non-json request', function() {
    get('/user1.json', function(res) {
      res.has.statusCode(406); //not acceptable
    });
  });
});
```

## license

MIT
