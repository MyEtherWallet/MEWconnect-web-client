#!/usr/bin/env node
require('dotenv').config()
const path = require('path')
console.log(path.resolve(__dirname, '.env')) // todo remove dev item

const app = require('./SimpleExpressServer')
const https = require('https')
const fs = require('fs')


const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../../example/sampleCerts/devCert.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../../example/sampleCerts/devCert.cert')),
  requestCert: false,
  rejectUnauthorized: false
}
console.log(process.env.BIND_SERVER) // todo remove dev item
// eslint-disable-next-line no-use-before-define
const port = normalizePort(process.env.APP_PORT || '3100')
const host = process.env.APP_SERVER || '127.0.0.1'
app.set('port', port)

const server = https.createServer(options, app)

function normalizePort (val) {
  const portInner = parseInt(val, 10)

  if (Number.isNaN(portInner)) {
    // named pipe
    return val
  }

  if (portInner >= 0) {
    // port number
    return portInner
  }

  return false
}

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`
  // eslint-disable-next-line no-console
  console.log(`Listening on ${bind}`)
  console.log('server details:', addr) // todo remove dev item
}

server.listen({host: host, port: port})
server.on('error', onError)
server.on('listening', onListening)
