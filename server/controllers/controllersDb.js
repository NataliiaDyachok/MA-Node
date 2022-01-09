const Sequelize = require('sequelize');
const ApiError = require('../error/ApiError');
const { helper1: helpFilterItems } = require('../helpers');

// const { db: dbConfig } = require('../config');
// const db = require('../db')(dbConfig);

const db = require('../db');

// const dbWrap = db.dbWrapper();

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

const productPost = (req, res, next) => {

  try {
    const errorsArray = helpFilterItems.validate(req.body);
    if (errorsArray.length>0){
      throw(errorsArray);
    }

    const arrProducts = getModifiedProductsArray(req.body);

    arrProducts.forEach(itemProduct => {
      db.dbWrapper().createProduct(itemProduct)
        .then(p => console.log(`p ${JSON.stringify(p)}`));
    });

  } catch (error) {
    return next(ApiError.badRequest(error));
  }

  return res.json(req.body);
};

const productUpdate = (req, res, next) => {

  try {
    const errorsArray = helpFilterItems.validate(req.body);
    if (errorsArray.length>0){
      throw(errorsArray);
    }

    const arrProducts = getModifiedProductsArray(req.body);

    db.dbWrapper().updateProduct( req.query.id, arrProducts[0] )
      .then(p => console.log(`p ${JSON.stringify(p)}`));


  } catch (error) {
    return next(ApiError.badRequest(error));
  }

  return res.json(req.body);
};

const productGet = (req, res, next) => {
  try {

    db.dbWrapper().getProduct( req.query.id)
      .then(p => {
        console.log(`p ${JSON.stringify(p)}`);
        return res.json(p);
      });

  } catch (error) {
    return next(ApiError.badRequest(error));
  }

  return true;
};

const productGetAll = (req, res, next) => {
  try {

    db.dbWrapper().getAllProducts({ deletedAt: { [Sequelize.Op.is]: null } })
      .then(p => {
        console.log(`p ${JSON.stringify(p)}`);
        return res.json(p);
      });

  } catch (error) {
    return next(ApiError.badRequest(error));
  }

  return true;
};

const productDelete = (req, res, next) => {
  try {

    db.dbWrapper().deleteProduct( req.query.id)
      .then(p => {
        console.log(`p ${JSON.stringify(p)}`);
        return res.json({id: req.query.id, message: 'deleted'});
      });

  } catch (error) {
    return next(ApiError.badRequest(error));
  }

  return true;
};

module.exports = {
  productPost,
  productUpdate,
  productGet,
  productDelete,
  productGetAll,
};
