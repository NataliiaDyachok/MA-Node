const products = require('../data.json');

function getPriceWithoutSign(price) {
  return Number(price.replace('$', '').replace(',', '.'));
}

function getCost(product) {
  const hasWeight = product.weight && product.pricePerKilo;
  return hasWeight
    ? product.weight * getPriceWithoutSign(product.pricePerKilo)
    : product.quantity * getPriceWithoutSign(product.pricePerItem);
}

function getMaxProductsCost(arrProducts=products) {
  return arrProducts.sort((a, b) => getCost(b) - getCost(a))[0];
}

module.exports.getMaxProductsCost = getMaxProductsCost;
module.exports.getCost = getCost;
module.exports.getPriceWithoutSign = getPriceWithoutSign;
