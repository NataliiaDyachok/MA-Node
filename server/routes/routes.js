const express = require('express');
const controllers = require('../controllers/controllers');

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
      return res.sendStatus(404);
  }

  if (err.status === 500) {
      return res.sendStatus(500);
  }

  if (err.status) res.sendStatus(err.status);
  next();
});

module.exports =  app;
