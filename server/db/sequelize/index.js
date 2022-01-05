/* eslint-disable import/no-dynamic-require */
const { readdirSync } = require('fs');
const path = require('path');
// const { stringify } = require('querystring');
const Sequelize = require('sequelize');

const modelsDir = path.join(__dirname, './models');

const name = 'sequelize';

module.exports = (config) => {
  const sequelize = new Sequelize(config);
  const db = {};

  readdirSync(modelsDir)
  .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
  .forEach(file => {
    // eslint-disable-next-line global-require,
    const model = require(path.join(modelsDir, file))
      (sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return {
    testConnection: async () => {
      try{
        console.log(`hello from ${name} testConnection`);
        await sequelize.authenticate();
      } catch (err) {console.error(err.message || err);
        throw err;
      };
    },

    close: async () => {
      console.log(`INFO: Closing ${name} DB wrapper`);
      sequelize.close();
    },

    createProduct: async (product) => {
      try{
        if (!product.item)
          { throw new Error('ERROR: no product item defined' ); };
        if (!product.type)
          { throw new Error('ERROR: no product type defined' ); };
        if (!product.unit)
          { throw new Error('ERROR: no product unit defined' ); };

        const p = JSON.parse(JSON.stringify(product));

        const timeStamp = Date.now();

        // delete(p.id);
        p.price = p.price || 0;
        p.quantity = p.quantity || 1;
        p.createdAt = timeStamp;
        p.updatedAt = timeStamp;

        const res = await db.Product.create(p);

        console.log(
          `INFO: new product created ${JSON.stringify(res)}`
        );

      } catch (err){
        console.error(err.message || err);
        throw err;
      };
    },

    getProduct: async (id) => {
      try{
        if (!id){ throw new Error('ERROR: no product id defined' ); };

        const res = await db.Product.findOne({
          where: {
            id,
            deletedAt: { [Sequelize.Op.is]: null }
          }
        });

        console.log(
          `INFO: product by id ${JSON.stringify(res)}`
        );

        return res;

      } catch (err){
        console.error(err.message || err);
        throw err;
      };
    },

    // updateProduct: async ({id, ...product}) => {
    updateProduct: async (id, product) => {
      try{
        if (!id){ throw new Error('ERROR: no product id defined' ); };
        if (!Object.keys(product).length){
          throw new Error('ERROR: Nothing to update' );
        }

        const res = await db.Product.update(product, {
          where: {id},
          returning: true
        });

        console.log(
          `DEBUG: product updates ${JSON.stringify(res[1][0])}`
        );

      } catch (err){
        console.error(err.message || err);
        throw err;
      };
    },

    updateOrCreateProduct: async (product) => {
      try{

        if (!Object.keys(product).length){
          throw new Error('ERROR: Nothing to update' );
        }

        const retProduct = await db.Product.findOne({
        // await db.Product.findOne({
          where: {
            [Sequelize.Op.and]:
              [
                { item: product.item },
                { type: product.type },
                { unit: product.unit },
                { price: product.price },
                { quantity: product.quantity },
              ],
              deletedAt: { [Sequelize.Op.is]: null }
          }
        });
        // .then( async (retProduct) => {

        if (retProduct === null){
          await db.Product.create(product)
          .then(() =>
            console.log(
              `INFO: The product was created ${JSON.stringify(product)}`
            )
          );
        } else {
          // eslint-disable-next-line no-param-reassign
          retProduct.price += product.price;
          // eslint-disable-next-line no-param-reassign
          retProduct.quantity += product.quantity;

          await retProduct.save()
            .then(() =>
              console.log(
                `INFO: The product was updated ${JSON.stringify(retProduct)}`
              )
            );
        }


      } catch (err){
        console.error(err.message || err);
        throw err;
      };
    },

    deleteProduct: async (id) => {
      try{
        if (!id){ throw new Error('ERROR: no product id defined' ); };

        // const res = await db.Product.destroy({ where: {id} });
        const res =
          await db.Product.update({ deletedAt: Date.now() }, { where: {id} });

        console.log(
          `INFO: product by id ${JSON.stringify(id)} was deleted`
        );

        return res[0];

      } catch (err){
        console.error(err.message || err);
        throw err;
      };
    },

  };
};
