const constants = require('../constants');
// eslint-disable-next-line import/no-dynamic-require
const products = require(constants.pathToJSONFile);

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

function getProductsPromises(arrProducts=products) {
	return Promise.all(arrProducts.map(item =>
		getDiscount()
		.then((discount) => getProductWithDiscount(item, discount))
	));
};

module.exports = getProductsPromises;
