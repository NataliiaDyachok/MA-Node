const {pipeline} = require('stream');
const util = require('util');
const fs = require('fs');
const path = require('path');

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
    console.error('CSV pipeline failed', err);
  }
}

module.exports = {uploadCsv};
