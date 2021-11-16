
const constants = require('../constants');
const products = require(constants.pathToJSONFile);

const schema = {
  item: (value) => {
    return typeof value === 'string';
  },
  type: (value) => {
    return typeof value === 'string';
  },
  weight: (value) => {
    return typeof value === 'number';
  },
  quantity: (value) => {
    return typeof value === 'number';
  },
  pricePerKilo: (value) => {
    return /^\$?[\d,]+(\.\d*)?$/.test(value);
  },
  pricePerItem: (value) => {
    return /^\$?[\d,]+(\.\d*)?$/.test(value);
  },
};

function validate(arrProducts) {
  
  let errors = [];
  
  if (!Array.isArray(arrProducts)){
    errors.push(arrProducts);
    return errors;
  }
  
  errors = arrProducts.reduce((accumulator, product) => {
    const errors = Object.keys(product).filter((key) => {
      return !schema[key](product[key]);
    })
    return [...accumulator, ...errors];
  }, []);

  return errors;
}

function filterByParams(params, arrProducts=products){
  const errorsArray = validate(arrProducts);
  if (errorsArray.length>0){
    return {
      code: 400,
      message: errorsArray,
    };
  }
  
  for (const key of params.keys()) {
    arrProducts = filterItems(arrProducts, key, params.get(key));
  }

  return {
    code: arrProducts.length > 0? 200: 204,
    message: arrProducts,
  };
}

function filterItems(arrItems, parFilter, valFilter) {
  return arrItems.filter(item => item[parFilter] === valFilter);
}

module.exports = {filterByParams, validate};
