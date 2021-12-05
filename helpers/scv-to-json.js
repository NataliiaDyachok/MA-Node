const {Transform} = require('stream');


function createCsvToJson(){
  let isFirst = true;

  const transform = (chunk, encoding, callback) => {
    if (isFirst){
      // {}

      isFirst = false;

      // callback(null, 'JSON string\n');
      // return;
    }

    // const str = chunk.toString();
    // convert csv chunk to json

    callback(null, chunk);
  };

  const flush = callback => {
    console.log('No more data is read.');
    callback(null, '\nFinish!');
  };

  return new Transform(transform, flush);

}

module.exports = createCsvToJson;
