const fs = require('fs');
const ApiError = require('../error/ApiError');

const { helper1: helpFilterItems,
  helper2: helpSortItems,
  helper3: helpFillPrice,
  helperDiscountPromise,
  helperDiscountPromiseAsyncAwait,
  helperDiscountPromisify,
} = require('../helpers');

const constants = require('../constants');

const {pathToJSONFile} = constants;

function filter(req, res, next) {
  let retObj = {};
  try {
    retObj = helpFilterItems.filterByParams(req.query);
  } catch (error) {
    return next(ApiError.badRequest(error));
  }
  return res.json(retObj.message);
}

function filterPost(req, res, next) {
  let resObj;

  try {
    resObj = helpFilterItems.filterByParams(req.query, req.body);
  } catch (error) {
    return next(ApiError.badRequest(error));
  }

  return res.json(resObj.message);
}

function topprice(req, res, next) {
  let retObj = {};

  try {
    retObj = helpSortItems();
  } catch (error) {
    return next(ApiError.badRequest(error));
  }

  return res.json(retObj.message);
}

function toppricePost(req, res, next) {
  let resObj;

  try {
    resObj = helpSortItems(req.body);
  } catch (error) {
    return next(ApiError.badRequest(error));
  }

  return res.json(resObj.message);
}

function commonprice(req, res, next) {
  let retObj = {};

  try {
    retObj = helpFillPrice();
  } catch (error) {
    return next(ApiError.badRequest(error));
  }

  return res.json(retObj.message);
}

function commonpricePost(req, res, next) {
  let resObj;

  try {
    resObj = helpFillPrice(req.body);
  } catch (error) {
    return next(ApiError.badRequest(error));
  }

  return res.json(resObj.message);
}

function dataPost(req, res, next) {
  const errorsArray = helpFilterItems.validate(req.body);
  if (errorsArray.length>0){
    console.log('The file was not saved!');
    return next(ApiError.badRequest(errorsArray));
  }

  const content = JSON.stringify(req.body);

  // eslint-disable-next-line consistent-return
  fs.writeFile(pathToJSONFile, content, 'utf8', (err) => {
      if (err) {
          return console.log(err);
      }
      console.log('The file was saved!');
  });

  return res.json('The file was saved!');
}

function discountPromise(req, res) {

  helperDiscountPromise()
    .then(items => {
      res.json(items);
    });

}

function discountPromisePost(req, res, next) {
  const errorsArray = helpFilterItems.validate(req.body);
  if (errorsArray.length>0){
    return next(ApiError.badRequest(errorsArray));
  }

  return helperDiscountPromise(req.body)
    .then(items => {
      res.json(items);
    });
}

function discountPromisify(req, res) {
  helperDiscountPromisify()
    .then(items => {
      res.json(items);
    });
}

function discountPromisifyPost(req, res, next){
  const errorsArray = helpFilterItems.validate(req.body);
  if (errorsArray.length>0){
    return next(ApiError.badRequest(errorsArray));
  }

  return helperDiscountPromisify(req.body)
    .then(items => {
      res.json(items);
    });
}

function discountPromiseAsyncAwait(req, res) {
  helperDiscountPromiseAsyncAwait()
    .then(items => {
      res.json(items);
    });
}

function discountPromiseAsyncAwaitPost(req, res, next) {
  const errorsArray = helpFilterItems.validate(req.body);
  if (errorsArray.length>0){
    return next(ApiError.badRequest(errorsArray));
  }

  return helperDiscountPromiseAsyncAwait(req.body)
    .then(items => {
      res.json(items);
    });
}

function notFound(req, res) {
  const resObj = { message: 'Bad Request', code: 400 };

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = resObj.code;
  res.write(resObj.message);
  res.end();
}

module.exports = {
  filter,
  filterPost,
  topprice,
  toppricePost,
  commonprice,
  commonpricePost,
  dataPost,
  discountPromise,
  discountPromisePost,
  discountPromiseAsyncAwait,
  discountPromiseAsyncAwaitPost,
  discountPromisify,
  discountPromisifyPost,
  notFound,
};
