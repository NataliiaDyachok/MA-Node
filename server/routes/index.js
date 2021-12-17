const Router = require('express');

const router = new Router();
const handleRouter = require('./routes');
const handleStreamRouter = require('./routesStream');

// router.use('/store/csv', handleStreamRouter);
router.use('/store', handleStreamRouter);
router.use('/', handleRouter);

module.exports = router;
