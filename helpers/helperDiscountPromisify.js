const util = require('util');
const constants = require('../constants');
// eslint-disable-next-line import/no-dynamic-require
const products = require(constants.pathToJSONFile);

const getRandomDiscount = require('./helperRandomizer');

const getRandomDiscountPromisify =
  util.promisify(getRandomDiscount);

const { getProductWithDiscount } = require('./helperCost') ;

function getArrayProductsPromisify(arrProducts=products) {

  // const itemsPromisify = arrProducts
  // .map(product => getRandomDiscountPromisify()
  //   .then((discount) => getProductWithDiscount(product, discount)
  //       , () => {
  //        getRandomDiscountPromisify()
  //        .then((discount) => getProductWithDiscount(product, discount)
  //        , () => product);
  //      }
  //    )
  // );

  // const itemsPromisify = (arrProducts
  //   .map(product => getRandomDiscountPromisify()
  //     .then((discount) => getProductWithDiscount(product, discount))
  //     .catch(() => {
  //        getRandomDiscountPromisify()
  //        .then((discount) => getProductWithDiscount(product, discount))
  //        .catch(() => (product));
  //      })
  // ));

  // const itemsPromisify = (arrProducts
  //   .map((product) =>
  //     getRandomDiscountPromisify()
  //       .then((discount) => discount)
  //       .catch(() => {
  //         getRandomDiscountPromisify()
  //         .then((discount) => discount)
  //         .catch(() => 0);
  //       })
  //       .then((discount) => getProductWithDiscount(product, discount))

  //   ));


  const itemsPromisify = (arrProducts
    .map((product) =>
        getRandomDiscountPromisify()
          .then((discount) => discount)
          .catch(() => {
            getRandomDiscountPromisify()
            .then((discount) => discount)
            .catch(() => 0);
          })
          .then((discount) => getProductWithDiscount(product, discount))
    ));

  return itemsPromisify;
}

module.exports = getArrayProductsPromisify;
