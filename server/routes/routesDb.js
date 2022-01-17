const Router = require('express');
const controllers = require('../controllers/controllers');
const controllersDb = require('../controllers/controllersDb');
// const handleStreamRoutes = require('../controllers/controllersStreamDB');

const router = new Router();
router.post('/product', controllersDb.productPost); // add
router.put('/product', controllersDb.productUpdate); // update
router.get('/product', controllersDb.productGet);
router.get('/product-all', controllersDb.productGetAll);
router.delete('/product', controllersDb.productDelete);

router.put('/order', controllersDb.orderPost); // add

// router.put('/csv', handleStreamRoutes);

router.use(controllers.notFound);

module.exports =  router;
