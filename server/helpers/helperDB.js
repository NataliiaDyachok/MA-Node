// const { Op } = require('sequelize');
const db = require('../db');


const getModifiedProductsArray = (arrProducts) =>
  Array.from(arrProducts, product => {
    const hasWeight = product.weight && product.pricePerKilo;
    let price = hasWeight? product.pricePerKilo: product.pricePerItem;
    price = price.replace(',','.');
    price = price.replace('$','');

    const cloneItem = {};
    cloneItem.item = product.item;
    cloneItem.type = product.type;
    cloneItem.unit = hasWeight? 'kilo': 'quantity';
    cloneItem.price = Number(price.replace('$',''));
    cloneItem.quantity = Number(hasWeight? product.weight: product.quantity);

    return cloneItem;
  });

function writeArrayInDB(productArray){
  const arr = getModifiedProductsArray(productArray);

  return Promise.all(arr.forEach((productItem) =>  {
    db.dbWrapper().updateOrCreateProduct(productItem);
  }));
}

module.exports = writeArrayInDB;

