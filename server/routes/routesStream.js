const { notFound } = require('../controllers/controllers');
const { uploadCsv } = require('../controllers/controllersStream');

// eslint-disable-next-line consistent-return
async function handleStreamRoutes(request, response){
  const {url, method} = request;

  if (method === 'PUT' && url === '/store/csv'){
    try {
      await uploadCsv(request);
    } catch (err) {
      console.error('Failed to upload CSV', err);

      response.setHeader('Content-Type', 'text');
      response.statusCode = 500;
      response.end(JSON.stringify({status: 'error'}));
      return err;
    }

    response.setHeader('Content-Type', 'text');
    response.statusCode = 200;
    response.end(JSON.stringify({status: 'ok'}));
    // eslint-disable-next-line consistent-return
    return;
  }

  notFound(request, response);
}

module.exports = {handleStreamRoutes};
