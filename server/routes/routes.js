const Router = require('express');
const controllers = require('../controllers/controllers');

const router = new Router();

router.post('/filter', controllers.filterPost);
router.get('/filter', controllers.filter);

router.get('/topprice', controllers.topprice);
router.post('/topprice', controllers.toppricePost);

router.get('/commonprice', controllers.commonprice);
router.post('/commonprice', controllers.commonpricePost);

router.get('/discount/promise', controllers.discountPromise);
router.post('/discount/promise', controllers.discountPromisePost);

router.get('/discount/async', controllers.discountPromiseAsyncAwait);
router.post('/discount/async', controllers.discountPromiseAsyncAwaitPost);

router.get('/discount/promisify', controllers.discountPromisify);
router.post('/discount/promisify', controllers.discountPromisifyPost);

router.post('/data', controllers.dataPost);

router.use(controllers.notFound);

module.exports =  router;
