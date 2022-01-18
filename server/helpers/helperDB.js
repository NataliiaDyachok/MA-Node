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

  async function writeArrayInDB(productArray){
    const arr = getModifiedProductsArray(productArray);

    // eslint-disable-next-line no-restricted-syntax
    for (const productItem of arr) {
      // eslint-disable-next-line no-await-in-loop
      await db.dbWrapper().updateOrCreateProduct(
        productItem,
        (err, res) => {
            console.log(`!!! Product err done ${err}`);
            console.log(`!!! Product res done ${res}`);
        });
    }
};

async function checkAndInputOrderData(arrProducts, [login, password]){
  const arr = getModifiedProductsArray(arrProducts);

  // eslint-disable-next-line no-restricted-syntax
  for (const productItem of arr) {
    // eslint-disable-next-line no-await-in-loop
    await db.dbWrapper().checkAndCreateItemOrder(
      productItem,
      [login, password],
      (err, res) => {
          console.log(`!!! Product err done ${err}`);
          console.log(`!!! Product res done ${res}`);
      });
  }
};


module.exports = {writeArrayInDB,
  checkAndInputOrderData,
};

