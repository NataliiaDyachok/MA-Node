const util = require('util');
const constants = require('../constants');
// eslint-disable-next-line import/no-dynamic-require
const products = require(constants.pathToJSONFile);

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

function getProductsPromisify(arrProducts=products) {
	return Promise.all(arrProducts.map(item =>
		getDiscount()
		.then((discount) => getProductWithDiscount(item, discount))
	));
};

module.exports = getProductsPromisify;
