/* eslint-disable import/no-unresolved */
const express = require('express');

const bodyParser = require('body-parser');

const http = require('http');

const { env } = require('process');

require('dotenv').config();

const routes = require('./server/routes');
const { handleStreamRoutes } = require('./server/routesStream');

const {PORT} = env;
const app = express();
const server = http.createServer(app);
const SHUTDOWN_TIMEOUT = 5000;
const connections = new Map();

// eslint-disable-next-line import/order
const io  = require('socket.io')(server);

app.io = io;

const timeout = msec => new Promise(resolve => {
  setTimeout(resolve, msec);
});

// Parse application/json
app.use(bodyParser.json());

// Parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {

  const auth = {login: 'Masters', password: 'Academy'} // change this

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[0] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  // Verify login and password are set and correct
  if (login && password && login === auth.login && password === auth.password) {
    // Access granted...
    return next()
  }

  // Access denied...
  res.set('WWW-Authenticate', 'Basic realm="401"') // change this
  res.status(401).send('Authentication required.') // custom message
})

app.put('/store/csv', handleStreamRoutes);

app.use('/', routes);

app.use((req, res, next) => {
  next({
      status: 404,
      message: 'Not Found',
  });
});

// eslint-disable-next-line consistent-return
app.use((err, req, res, next) => {
  if (err.status === 404) {
      // return res.status(400).render('404');
      return res.sendStatus(404);
  }

  if (err.status === 500) {
      return res.sendStatus(500);
  }

  if (err.status) res.sendStatus(err.status);
  next();
});

// eslint-disable-next-line no-unused-expressions
http.Server.listen;
server.listen(port=PORT || 3000, (res, req) => {
  // console.log(res);
  // console.log(req); connections.set(res.connection, res);
  console.log(`Server successfully started on port ${port}`);
});

io.sockets.on('connection', connection => {
// io.on('connection', connection => {
  console.log('New connection');

  connection.on('close', () => {
    console.log('Close');
    connections.delete(connection);
  });
});

const showConnections = () => {
  console.log('Connection:', [...connections.values()].length);
  // eslint-disable-next-line no-restricted-syntax
  for (const connection of connections.keys()) {
    const { remoteAddress, remotePort } = connection;
    console.log(`  ${remoteAddress}:${remotePort}`);
  }
};

const closeConnections = async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [connection, res] of connections.entries()) {
    connections.delete(connection);
    res.end('Server stopped');
    connection.destroy();
  }
};

const freeResources = async () => {
  console.log('Free resources');
};

const gracefulShutdown = async () => {
  server.close(error => {
    if (error) {
      console.log(error);
      process.exit(1);
    }
  });
  await timeout(SHUTDOWN_TIMEOUT);
  await freeResources();
  await closeConnections();
};

async function exitHandler(){
  console.log();
  console.log('Graceful shutdown');
  showConnections();
  await gracefulShutdown();
  showConnections();
  console.log('Bye');
  process.exit(0);
}

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);

module.exports = {app};
