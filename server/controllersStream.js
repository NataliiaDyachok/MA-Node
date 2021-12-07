const {pipeline} = require('stream');
// const {createGunzip} = require('zlib');
// const {promisify} = require('util');
const util = require('util');


const fs = require('fs');
const path = require('path');

// const promisifiedPipeline = promisify(pipeline);
const promisifiedPipeline = util.promisify(pipeline);

const {scvToJson: createCsvToJson} = require('../helpers');



async function uploadCsv(inputStream){
  // const gunZip = createGunzip();

  const timestamp = Date.now();
  const filePath = path.resolve(__dirname, `../upload/${timestamp}.json`);

  const outputStream = fs.createWriteStream(filePath);
  const scvToJson = createCsvToJson()
  .catch(err => console.error('CSV validate failed', err));

  try{
    // await promisifiedPipeline(inputStream, gunZip, scvToJson, outputStream);
    await promisifiedPipeline(inputStream, scvToJson, outputStream);
  } catch (err) {
    console.error('CSV pipeline failed', err);
  }

}

module.exports = {uploadCsv};
