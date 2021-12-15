// const constants = require('../constants');
/* eslint-disable global-require */
const {getPathToMostRecentFile} = require('../constants');

const {validate: helpFilterItemsValidate} = require('./helper1');

function getPriceWithoutSign(price) {
  return Number(price.replace('$', '').replace(',', '.'));
}

function getCost(product) {
  const hasWeight = product.weight && product.pricePerKilo;
  return hasWeight
    ? product.weight * getPriceWithoutSign(product.pricePerKilo)
    : product.quantity * getPriceWithoutSign(product.pricePerItem);
}

function getMaxProductsCost(arrProducts
  // eslint-disable-next-line import/no-dynamic-require
  = require(getPathToMostRecentFile())
) {
  const errorsArray = helpFilterItemsValidate(arrProducts);
  if (errorsArray.length>0){
    throw(errorsArray);
  }

  const maxCostItem = arrProducts.sort((a, b) => getCost(b) - getCost(a))[0];
  return {
    code: 200,
    message: maxCostItem,
  };
}

module.exports = getMaxProductsCost;
