function getPriceWithoutSign(price) {
  return Number(price.replace('$', '').replace(',', '.'));
}

function getCost(product) {
  const hasWeight = product.weight && product.pricePerKilo;
  return hasWeight
    ? product.weight * getPriceWithoutSign(product.pricePerKilo)
    : product.quantity * getPriceWithoutSign(product.pricePerItem);
}

function getPriceWithDiscount(price, discountProc){
	return (price * (100 - discountProc) / 100).toFixed(2);
}

function getProductWithDiscount(product, discount) {

  const discountProc = Number(discount).isNaN
  || discount === undefined ? 0 : discount;

  const price = getCost(product);
  let priceWithDiscount = getPriceWithDiscount(price, discountProc);

  if (product.item === 'pineapple' && product.type === 'Red Spanish') {
    priceWithDiscount = getPriceWithDiscount(priceWithDiscount, discountProc);
  }

  if (product.item === 'orange' && product.type === 'Tangerine') {
    priceWithDiscount = getPriceWithDiscount(priceWithDiscount, discountProc);
    priceWithDiscount = getPriceWithDiscount(priceWithDiscount, discountProc);
  }

  return { ...product, priceWithDiscount, discountProc };
}

module.exports = { getProductWithDiscount, getCost };
