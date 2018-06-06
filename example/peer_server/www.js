#!/usr/bin/env node

const app = require('./SimpleExpressServer');
const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../../example/sampleCerts/devCert.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../../example/sampleCerts/devCert.cert')),
  requestCert: false,
  rejectUnauthorized: false,
};


// eslint-disable-next-line no-use-before-define
const port = normalizePort(process.env.PORT || '3100');
app.set('port', port);


const server = https.createServer(options, app);


function normalizePort(val) {
  const portInner = parseInt(val, 10);

  if (Number.isNaN(portInner)) {
    // named pipe
    return val;
  }

  if (portInner >= 0) {
    // port number
    return portInner;
  }

  return false;
}


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  // eslint-disable-next-line no-console
  console.log(`Listening on ${bind}`);
}


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
