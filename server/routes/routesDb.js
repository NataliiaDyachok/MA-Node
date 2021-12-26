const Router = require('express');
const controllers = require('../controllers/controllers');
const controllersDb = require('../controllers/controllersDb');

const router = new Router();
router.post('/product', controllersDb.productPost); // add
router.put('/product', controllersDb.productUpdate); // update
router.get('/product', controllersDb.productGet);
router.delete('/product', controllersDb.productDelete);

router.use(controllers.notFound);

module.exports =  router;
