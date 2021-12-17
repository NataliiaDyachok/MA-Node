const {pipeline} = require('stream');
const util = require('util');
const fs = require('fs');
const path = require('path');
const ApiError = require('../error/ApiError');
const promisifiedPipeline = util.promisify(pipeline);
const {scvToJson: createCsvToJson} = require('../helpers');

async function uploadCsv(inputStream){
  const timestamp = Date.now();
  const filePath = path.resolve(__dirname, `../upload/${timestamp}.json`);

  const outputStream = fs.createWriteStream(filePath);
  const scvToJson = createCsvToJson();

  try{
    await promisifiedPipeline(inputStream, scvToJson, outputStream);
  } catch (err) {
    // console.error('CSV pipeline failed', err);
    throw('CSV pipeline failed '+err.message);
  }
}

async function handleStreamRoutes(request, response, next){
  // const {url, method} = request;

  try {
    await uploadCsv(request);
    response.setHeader('Content-Type', 'text');
    response.statusCode = 200;
    response.end(JSON.stringify({status: 'ok'}));
  } catch (err) {
    // throw('Failed to upload CSV');
    next(ApiError.badRequest('Failed to upload CSV'));
  }

  // response.setHeader('Content-Type', 'text');
  // response.statusCode = 200;
  // response.end(JSON.stringify({status: 'ok'}));
    // eslint-disable-next-line consistent-return
    // return;
  
  // notFound(request, response);
}

module.exports = handleStreamRoutes;
