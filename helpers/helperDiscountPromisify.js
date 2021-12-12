const util = require('util');
/* eslint-disable global-require */
const {getPathToMostRecentFile} = require('../constants');

const getRandomDiscount = require('./helperRandomizer');

const getRandomDiscountPromisify =
  util.promisify(getRandomDiscount);

const { getProductWithDiscount } = require('./helperCost') ;

function getDiscount() {
	return new Promise((resolve) => {
		getRandomDiscountPromisify((err, result) => {
		if (err)
			return resolve(getDiscount());
		return resolve(result);
		});
	});
}

function getProductsPromisify(arrProducts
  // eslint-disable-next-line import/no-dynamic-require
  = require(getPathToMostRecentFile())
) {
	return Promise.all(arrProducts.map(item =>
		getDiscount()
		.then((discount) => getProductWithDiscount(item, discount))
	));
};

module.exports = getProductsPromisify;
