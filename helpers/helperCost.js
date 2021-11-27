function getPriceWithoutSign(price) {
  return Number(price.replace('$', '').replace(',', '.'));
}

function getCost(product) {
  const hasWeight = product.weight && product.pricePerKilo;
  return hasWeight
    ? product.weight * getPriceWithoutSign(product.pricePerKilo)
    : product.quantity * getPriceWithoutSign(product.pricePerItem);
}

function getProductWithDiscount(product, discount) {

  const discountProc = Number(discount).isNaN
  || discount === undefined ? 0 : discount;

  const price = getCost(product);
  const priceWithDiscount = price * (100 - discountProc) / 100;
  return { ...product, priceWithDiscount };
}

module.exports = { getProductWithDiscount, getCost };
