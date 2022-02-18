const Router = require('express');
const controllers = require('../controllers/controllers');
const controllersDb = require('../controllers/controllersDb');
// const handleStreamRoutes = require('../controllers/controllersStreamDB');
const {registerPost, loginPost, refreshPost} = require('../controllers/controllersAuth');
const { authorize } = require('../middleware/authMiddleware');

const router = new Router();
router.post('/register', registerPost) ;
router.post('/login', loginPost) ;
router.post('/refresh', refreshPost) ;

router.use(authorize);

router.post('/product', controllersDb.productPost); // add
router.put('/product', controllersDb.productUpdate); // update
router.get('/product', controllersDb.productGet);
router.get('/product-all', controllersDb.productGetAll);
router.delete('/product', controllersDb.productDelete);

router.put('/order', controllersDb.orderPost); // add

router.use(controllers.notFound);

module.exports =  router;
