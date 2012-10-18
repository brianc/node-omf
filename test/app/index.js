var port = process.argv[2]||3000;

require('./app').listen(port, function() {
  console.log('listening on %d', port);
});
