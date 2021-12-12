// const constants = require('../constants');
/* eslint-disable global-require */
const {getPathToMostRecentFile} = require('../constants');

const getRandomDiscount = require('./helperRandomizer');

const { getProductWithDiscount } = require('./helperCost') ;

function getDiscount() {
	return new Promise((resolve) => {
		getRandomDiscount((err, result) => {
		if (err)
			return resolve(getDiscount());
		return resolve(result);
		});
	});
}

async function getFilledProduct(item){
  const discount = await getDiscount();
  const retProduct = await getProductWithDiscount(item, discount);
  return retProduct;
}

function getProductsPromisesAsyncAwait(arrProducts
  // eslint-disable-next-line import/no-dynamic-require
  = require(getPathToMostRecentFile())
) {
	return Promise.all(arrProducts.map(item => getFilledProduct(item)));
};

module.exports = getProductsPromisesAsyncAwait;
