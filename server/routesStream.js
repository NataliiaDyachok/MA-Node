const { notFound } = require('./controllers');
const { uploadCsv } = require('./controllersStream');

async function handleStreamRoutes(request, response){
  const {url, method} = request;

  if (method === 'PUT' && url === '/store/csv'){
    try {
      await uploadCsv(request);
    } catch (err) {
      console.error('Failed to upload CSV', err);

      // response.setHeader('Content-Type', 'text');
      response.statusCode = 500;
      response.end(JSON.stringify({status: 'error'}));
      return;
    }

    // response.setHeader('Content-Type', 'text');
    // response.statusCode = 200;
    // response.end(JSON.stringify({status: 'ok'}));
    return;
  }

  notFound(response);
}

module.exports = {handleStreamRoutes};
