const util = require('util');
const constants = require('../constants');
// eslint-disable-next-line import/no-dynamic-require
const products = require(constants.pathToJSONFile);

const getRandomDiscount = require('./helperRandomizer');

const { getProductWithDiscount } = require('./helperCost') ;

function getProductPromisify(product) {
  // eslint-disable-next-line no-unused-vars
  return util.promisify((reject, resolve) => {

    const callbackSuccess = (discount) => {
      const productWithDiscount = getProductWithDiscount(product, discount);
      resolve (productWithDiscount);
    };

    const callbackErr = () => {
      const innerCallback = (err, randomNumber) => {
        // eslint-disable-next-line no-unused-expressions
        err ? resolve(product) : callbackSuccess(randomNumber);
      };
      getRandomDiscount(innerCallback);
    };

    const callback = (err, randomNumber) => {
      // eslint-disable-next-line no-unused-expressions
      err ? callbackErr(err) : callbackSuccess(randomNumber);
    };

    getRandomDiscount(callback);

   });
}

function getArrayProductsPromisify(arrProducts=products) {
  const productsPromises =
    arrProducts.map(product => getProductPromisify(product));

  return productsPromises;
}

module.exports = getArrayProductsPromisify;
