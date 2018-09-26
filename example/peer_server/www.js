const http = require('http');
const config = require('./config');
const app = require('./SimpleExpressServer');

process.env.NOD_ENV = 'development';

const createLogger = require('logging').default;
const logger = createLogger('ExampleServer');

const port = normalizePort(config.port);
const host = config.host;
app.set('port', port);

const server = http.createServer(app);

function normalizePort(val) {
  const portInner = parseInt(val, 10);
  if (Number.isNaN(portInner)) {
    return val;
  }
  if (portInner >= 0) {
    return portInner;
  }
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`);
  logger.info('server details:', addr); // todo remove dev item
}

server.listen({ host: host, port: port });
server.on('error', onError);
server.on('listening', onListening);
