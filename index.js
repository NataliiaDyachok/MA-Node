const http = require('http');

const {requestHandler, connections} = require('./server/requestHandler');

const PORT = 3000;

const SHUTDOWN_TIMEOUT = 5000;

const timeout = msec => new Promise(resolve => {
  setTimeout(resolve, msec);
});

// http.createServer(requestHandler).listen(PORT, () => {
//   console.log(`Server successfully started on port ${PORT}`);
// });

const server = http.createServer(requestHandler);

server.on('connection', connection => {
  console.log('New connection');
  connection.on('close', () => {
    console.log('Close');
    connections.delete(connection);
  });
});

server.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});

// eslint-disable-next-line no-unused-expressions
http.Server.listen;

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
