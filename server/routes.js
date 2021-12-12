const express = require('express');
const controllers = require('./controllers');

// const router = express.Router;
const app = express();

app.route('/filter')
  .get((req, res) => controllers.filter(req, res))
  .post((req, res) => controllers.filterPost(req, res));

app.route('/topprice')
  .get((req, res) => controllers.topprice(req, res))
  .post((req, res) => controllers.toppricePost(req, res));

app.route('/commonprice')
  .get((req, res) => controllers.commonprice(req, res))
  .post((req, res) => controllers.commonpricePost(req, res));

app.route('/discount/promise')
  .get((req, res) => controllers.discountPromise(req, res))
  .post((req, res) => controllers.discountPromisePost(req, res));

app.route('/discount/async')
  .get((req, res) => controllers.discountPromiseAsyncAwait(req, res))
  .post((req, res) => controllers.discountPromiseAsyncAwaitPost(req, res));

app.route('/discount/promisify')
  .get((req, res) => controllers.discountPromisify(req, res))
  .post((req, res) => controllers.discountPromisifyPost(req, res));

app.post('/data', (req, res) => controllers.dataPost(req, res));

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

  next();
});

module.exports =  app;

// module.exports = (req, res) => {
//   const { pathname, method } = req;

  // if (pathname === '/filter' && method === 'GET')
  //   return controllers.filter(req, res);
  // if (pathname === '/filter' && method === 'POST')
  //   return controllers.filterPost(req, res);

  // if (pathname === '/topprice' && method === 'GET')
  //   return controllers.topprice(req, res);
  // if (pathname === '/topprice' && method === 'POST')
  //   return controllers.toppricePost(req, res);

  // if (pathname === '/commonprice' && method === 'GET')
  //   return controllers.commonprice(req, res);
  // if (pathname === '/commonprice' && method === 'POST')
  //   return controllers.commonpricePost(req, res);

  // if (pathname === '/data' && method === 'POST')
  //   return controllers.dataPost(req, res);

  // if (pathname === '/discount/promise' && method === 'GET')
  //   return controllers.discountPromise(req, res);
  // if (pathname === '/discount/promise' && method === 'POST')
  //   return controllers.discountPromisePost(req, res);

  // if (pathname === '/discount/async' && method === 'GET')
  //   return controllers.discountPromiseAsyncAwait(req, res);
    // if (pathname === '/discount/async' && method === 'POST')
    // return controllers.discountPromiseAsyncAwaitPost(req, res);

  // if (pathname === '/discount/promisify' && method === 'GET')
  //   return controllers.discountPromisify(req, res);
  // if (pathname === '/discount/promisify' && method === 'POST')
  //   return controllers.discountPromisifyPost(req, res);

//   return controllers.notFound(req, res);

// };
