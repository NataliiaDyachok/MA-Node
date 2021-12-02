const routes = require('./routes');

const connections = new Map();

// module.exports = (req, res) => {

function requestHandler (req, res) {
  const {
    url,
    headers: { host },
  } = req;

  const { pathname, searchParams } = new URL(url, `https://${host}`);

  connections.set(res.connection, res);

  let body = [];

  req
    .on('error', (err) => {
      console.error(err);
    })
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();
      routes({ ...req, pathname, body, params: searchParams }, res);
    });

    // .on('SIGTERM', () => {
    //   console.info('SIGTERM signal received.');
    //   console.log('Closing http server.');
    //   server.close(() => {
    //     console.log('Http server closed.');
    //   });
    // });
};

module.exports = {requestHandler, connections};
