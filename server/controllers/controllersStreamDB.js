const {pipeline} = require('stream');
const util = require('util');
const ApiError = require('../error/ApiError');

const promisifiedPipeline = util.promisify(pipeline);
const {scvToDB: createCsvToDB,
    helperDB} = require('../helpers');

const changeArr = async (arr) => {
  await helperDB.writeArrayInDB(arr)
    .then(() => {
      console.log('Writing to the database is over');
    });
};


async function uploadCsv(inputStream){
  const scvToDB = createCsvToDB.createCsvToDB();

  try{
    await promisifiedPipeline(inputStream, scvToDB);
    // .then((retArr) => console.log(JSON.stringify(retArr)));
  } catch (err) {
    // console.error('CSV pipeline failed', err);
    // eslint-disable-next-line no-throw-literal
    throw(`CSV pipeline failed ${err.message || err}`);
  }
}

async function handleStreamRoutes(request, response, next){

  try {
    await uploadCsv(request);
    await changeArr(createCsvToDB.getGlobalArrayUnique());

    response.setHeader('Content-Type', 'text');
    response.statusCode = 200;
    response.end(JSON.stringify({status: 'ok'}));
  } catch (err) {
    next(ApiError.badRequest('Failed to upload CSV'));
  }
}

module.exports = handleStreamRoutes;
