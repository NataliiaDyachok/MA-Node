const http = require('http');

const requestHandler = require('./server/requestHandler');

const PORT = 3000;

http.createServer(requestHandler).listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});

// eslint-disable-next-line no-unused-expressions
http.Server.listen;
