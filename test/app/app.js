var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
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

module.exports = app;
