# ORANGE MOCHA FRAPPUCCINO

[![Build Status](https://travis-ci.org/brianc/node-omf.png)](https://travis-ci.org/brianc/node-omf)

A little library to build http verification tests quickly on top of [mocha](https://github.com/visionmedia/mocha). Testing is a party, and everyone is invited!

![ORANGE MOCHA FRABBUCCINO](http://bmc.io/omf.gif)

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

Shorthand to just do the bare minimum sanity checks.  These are all equal.
```js
omf(app, function(app) {
  app.get('/', function(res) {
    res.has.statusCode(200);
  });

  app.get('/', 200);

  app.get('/');
});
```

Sometimes you do not know the url ahead of time.  ORANGE MOCHA FRAPPUCCINO supplies you with the same request object used in other tests so you can share a cookie jar and other things.  Example:

```js
//test login & post flow
omf(app, function(app) {
  var credentials = {
    email: 'test@example.com',
    password: 'pass'
  }

  app.post('/', {json: credentials}, function(res) {
    res.has.statusCode(200);
  });

  //at this point we have a login cookie, so lets create
  //a post for our next test...

  var post = {
    text: 'I love to write posts about things'
  };
  app.post('/posts', {json: postJson}, function(res) {
    res.has.statusCode(201); //created
    it('has post body and id', function() {
      //remember the scope of the 'it' tests have access to the
      //raw response from `request`
      var savedPost = this.response.body;
      assert(savedPost.id, 'created savedPost should have a body');
      assert.equal(savedPost.text, post.text);
      //let's save the posts ID to a place our other test can access it
      post.id = savedPost.id;
    });
  });

  //now lets test the fetching of the newly created post
  //remember, we didn't know the ID beforehand, so we don't know the direct url
  //we're basically dropping out of what ORANGE MOCHA FRAPPUCCINO gives you
  //as helpers and doing it ourselves manually but we still have 
  //our applications life-cycle managed and our urls rooted to our 
  //dynamically hosted app
  describe('getting saved post', function() {
    var optionsBuilder = function() {
      return {
        path: '/posts/' + post.id
      }
    };
    app.get(optionsBuilder, function(res) {
      res.has.statusCode(200);
      it('returns saved post', function() {
        var savedPost = res.body;
        assert.equal(savedPost.text, post.text);
      })
    });
  });
});

```

## license

MIT
