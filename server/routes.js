const controllers = require('./controllers');

module.exports = (req, res) => {
  const { pathname, method } = req;

  if (pathname === '/filter' && method === 'GET') return controllers.filter(req, res);
  if (pathname === '/filter' && method === 'POST') return controllers.filterPost(req, res);

  if (pathname === '/topprice' && method === 'GET') return controllers.topprice(req, res);
  if (pathname === '/topprice' && method === 'POST') return controllers.toppricePost(req, res);

  if (pathname === '/commonprice' && method === 'GET') return controllers.commonprice(req, res);
  if (pathname === '/commonprice' && method === 'POST') return controllers.commonpricePost(req, res);

  if (pathname === '/data' && method === 'POST') return controllers.dataPost(req, res);

  return controllers.notFound(req, res);
};