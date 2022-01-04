const Router = require('express');

const router = new Router();
// const handleRouter = require('./routes');

const handleRouter = require('./routesDb');

// const handleStreamRouter = require('./routesStream');

// router.use('/store', handleStreamRouter);
router.use('/', handleRouter);

module.exports = router;
