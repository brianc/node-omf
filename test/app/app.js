var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser())
app.use(express.json());

app.get('/', function(req, res, next) {
  res.send('O hai!');
});

app.get('/status/:status', function(req, res, next) {
  res.send(parseInt(req.params.status));
});

app.post('/data', function(req, res, next) {
  if(req.body.name === 'brian') {
    return res.send({user: 'brian'});
  }
  res.send(500, {pwnd: true});
});

app.put('/data', function(req, res, next) {
  res.send(201);
});

app.del('/data', function(req, res, next) {
  res.send(403);
});

app.get('/cookie', function(req, res, next) {
  res.cookie('remember', 'yes');
  res.send(req.cookies.remember || 'no');
});

module.exports = app;
