var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
  res.send('O hai!');
});

module.exports = app;
