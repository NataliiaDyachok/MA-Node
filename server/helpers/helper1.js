/* eslint-disable global-require */
const {getPathToMostRecentFile} = require('../constants');

const schema = {
  item: (value) => typeof value === 'string',
  type: (value) => typeof value === 'string',
  weight: (value) => typeof value === 'number',
  quantity: (value) => typeof value === 'number',
  pricePerKilo: (value) => /^\$?[\d,]+(\.\d*)?$/.test(value),
  pricePerItem: (value) => /^\$?[\d,]+(\.\d*)?$/.test(value),
};

function validate(arrProducts) {

  let errors = [];

  if (!Array.isArray(arrProducts)){
    errors.push(arrProducts);
    return errors;
  }

  errors = arrProducts.reduce((accumulator, product) => {
    errors = Object.keys(product)
      .filter((key) =>
        !schema[key] || !schema[key](product[key]));
    return [...accumulator, ...errors];
  }, []);

  return errors;
}

function filterItems(arrItems, parFilter, valFilter) {
  // eslint-disable-next-line eqeqeq
  return arrItems.filter(item => item[parFilter] == valFilter);
}

function filterByParams(params,
    arrProducts
      // eslint-disable-next-line import/no-dynamic-require
      = require(getPathToMostRecentFile())
) {
  const errorsArray = validate(arrProducts);
  if (errorsArray.length>0){
    throw(errorsArray);
  }

  let arrProducts2 = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(params)) {
    arrProducts2 = filterItems(arrProducts, key, params[key]);
  }

  return {
    code: arrProducts2.length > 0? 200: 204,
    message: arrProducts2,
  };
}



module.exports = {filterByParams, validate};
