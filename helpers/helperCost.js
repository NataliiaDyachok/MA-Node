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
  const price = getCost(product);
  const priceWithDiscount = price * (100 - discount) / 100;
  return { ...product, priceWithDiscount };
}

module.exports = { getProductWithDiscount, getCost };
