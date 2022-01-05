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
    productArray = getModifiedProductsArray(productArray);
    
    productArray.forEach((productItem) => {
        db.dbWrapper().createProduct(productItem)
         .then(p => console.log(`p ${JSON.stringify(p)}`))
         .catch(err => {console.error(`ERROR: ${(err.message || err) +'\n'+ JSON.stringify(productItem)}`)
            return err;
        });
    });
}

module.exports = writeArrayInDB;