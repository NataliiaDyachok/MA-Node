const helper1 = require('./helper1') ;
const helper2 = require('./helper2') ;
const helper3 = require('./helper3') ;
const helperDiscountPromise = require('./helperDiscountPromise');
const helperDiscountPromisify = require('./helperDiscountPromisify');
const helperDiscountPromiseAsyncAwait =
  require('./helperDiscountPromiseAsyncAwait');
const helperRandomizer = require('./helperRandomizer');
const scvToJson = require('./scv-to-json');
const scvToDB = require('./scv-to-DB');
// const helperStream = require('./helperStream') ;

module.exports = {helper1,
  helper2,
  helper3,
  helperDiscountPromise,
  helperDiscountPromisify,
  helperDiscountPromiseAsyncAwait,
  helperRandomizer,
  // helperStream,
  scvToJson,
  scvToDB,
};
