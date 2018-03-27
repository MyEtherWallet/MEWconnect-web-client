#!/usr/bin/env node

var app = require('./SimpleExpressServer');
var debug = require('debug')('localexpressserver:server');
// var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require("path");
let root = getRootDir();

console.log(path.resolve(".."));
console.log(path.resolve("."));
console.log(__dirname);
var options = {
    key: fs.readFileSync(path.join(path.resolve("."), "example", "sampleCerts","devCert.key")),
    cert: fs.readFileSync(path.join(path.resolve("."), "example", "sampleCerts","devCert.cert")),
    requestCert: false,
    rejectUnauthorized: false
};

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


var server = https.createServer(options, app);



server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}


function getRootDir(){
    let root = path.resolve(".");
    // root = path.join(root, "src");
    console.log(root);
    return  root;
}