const constants = require('../constants');
// eslint-disable-next-line import/no-dynamic-require
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

function changeProductsCost(arrProducts=products) {
  const errorsArray = helpFilterItemsValidate(arrProducts);
  if (errorsArray.length>0){
    return {
      code: 400,
      message: errorsArray,
    };
  }

  const retArrProducts = Array.from(arrProducts, itemProduct => {
    const cloneItem = { ...itemProduct };
    cloneItem.price = getCost(cloneItem);
    return cloneItem;
  });
  return {
    code: 200,
    message: retArrProducts,
  };
}

module.exports = changeProductsCost;

