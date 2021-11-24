const controllers = require('./controllers');

module.exports = (req, res) => {
  const { pathname, method } = req;

  if (pathname === '/filter' && method === 'GET')
    return controllers.filter(req, res);
  if (pathname === '/filter' && method === 'POST')
    return controllers.filterPost(req, res);

  if (pathname === '/topprice' && method === 'GET')
    return controllers.topprice(req, res);
  if (pathname === '/topprice' && method === 'POST')
    return controllers.toppricePost(req, res);

  if (pathname === '/commonprice' && method === 'GET')
    return controllers.commonprice(req, res);
  if (pathname === '/commonprice' && method === 'POST')
    return controllers.commonpricePost(req, res);

  if (pathname === '/data' && method === 'POST')
    return controllers.dataPost(req, res);

  if (pathname === '/discount/promise' && method === 'GET')
    return controllers.discountPromise(req, res);
  // if (pathname === '/discount/promise' && method === 'POST')
  //   return controllers.discountPromisePost(req, res);

  if (pathname === '/discount/async' && method === 'GET')
    return controllers.discountPromiseAsyncAwait(req, res);

  if (pathname === '/discount/promisify' && method === 'GET')
    return controllers.discountPromisify(req, res);

  return controllers.notFound(req, res);

};
