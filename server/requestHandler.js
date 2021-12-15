// // const express = require('express');

// const routes = require('./routes');
// const { handleStreamRoutes } = require('./routesStream');

// const connections = new Map();

// function requestHandler (req, res) {
//   const {
//     url,
//     headers: { host },
//     method,
//   } = req;

//   const { pathname, searchParams } = new URL(url, `https://${host}`);

//   connections.set(res.connection, res);

//   if (req.headers['content-type'] === 'text/csv' && method === 'PUT'){
//     handleStreamRoutes(req, res)
//       .catch(err => console.error('CSV handler failed', err));

//     return;
//   }

//   let body = [];

//   req
//     .on('error', (err) => {
//       console.error(err);
//     })
//     .on('data', (chunk) => {
//       body.push(chunk);
//     })
//     .on('end', () => {
//       body = Buffer.concat(body).toString();
//       routes({ ...req, pathname, body, params: searchParams }, res);
//     });

// };

// module.exports = {requestHandler, connections};
