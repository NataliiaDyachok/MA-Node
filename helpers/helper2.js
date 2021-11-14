const constants = require('../constants');
const products = require(constants.pathToJSONFile);

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

function getMaxProductsCost(arrProducts = products) {
  const errorsArray = helpFilterItemsValidate(arrProducts);
  if (errorsArray.length>0){
    return {
      code: 400,
      message: errorsArray,
    };
  }
  
  const maxCostItem = arrProducts.sort((a, b) => getCost(b) - getCost(a))[0];
  return {
    code: 200,
    message: maxCostItem,
  };
}

module.exports = getMaxProductsCost;
