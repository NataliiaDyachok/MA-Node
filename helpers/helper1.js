
const constants = require('../constants');
// eslint-disable-next-line import/no-dynamic-require
const products = require(constants.pathToJSONFile);

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

function filterByParams(params, arrProducts=products){
  const errorsArray = validate(arrProducts);
  if (errorsArray.length>0){
    return {
      code: 400,
      message: errorsArray,
    };
  }
  let arrProducts2 = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const key of params.keys()) {
    arrProducts2 = filterItems(arrProducts, key, params.get(key));
  }

  return {
    code: arrProducts.length > 0? 200: 204,
    message: arrProducts2,
  };
}



module.exports = {filterByParams, validate};
