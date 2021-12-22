const Router = require('express');
const { notFound } = require('../controllers/controllers');
const handleStreamRoutes = require('../controllers/controllersStream');

const router = new Router();

router.put('/csv', handleStreamRoutes);
router.use(notFound);

module.exports = router;
