const {pipeline} = require('stream');
const util = require('util');
const fs = require('fs');
const path = require('path');
const ApiError = require('../error/ApiError');

const promisifiedPipeline = util.promisify(pipeline);
const {scvToDB: createCsvToDB} = require('../helpers');

async function uploadCsv(inputStream){
  const timestamp = Date.now();
  const filePath = path.resolve(__dirname, `../upload/${timestamp}.json`);

  const outputStream = fs.createWriteStream(filePath);
  const scvToDB = createCsvToDB();

  try{
    await promisifiedPipeline(inputStream, scvToDB, outputStream);
  } catch (err) {
    // console.error('CSV pipeline failed', err);
    // eslint-disable-next-line no-throw-literal
    throw(`CSV pipeline failed ${err.message}`);
  }
}

async function handleStreamRoutes(request, response, next){

  try {
    await uploadCsv(request);
    response.setHeader('Content-Type', 'text');
    response.statusCode = 200;
    response.end(JSON.stringify({status: 'ok'}));
  } catch (err) {
    next(ApiError.badRequest('Failed to upload CSV'));
  }
}

module.exports = handleStreamRoutes;
