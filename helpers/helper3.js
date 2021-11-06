
function getPriceWithoutSign(price) {
  return Number(price.replace('$', '').replace(',', '.'));
}

function getCost(product) {
  const hasWeight = product.weight && product.pricePerKilo;
  return hasWeight
    ? product.weight * getPriceWithoutSign(product.pricePerKilo)
    : product.quantity * getPriceWithoutSign(product.pricePerItem);
}

function changeProductsCost(arrProducts) {
 return Array.from(arrProducts, itemProduct => {
  const cloneItem = { ...itemProduct };
  cloneItem.price = getCost(cloneItem);
  return cloneItem;
});
}

module.exports.changeProductsCost = changeProductsCost;
