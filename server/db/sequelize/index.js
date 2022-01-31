/* eslint-disable max-len */
/* eslint-disable import/no-dynamic-require */
const { readdirSync } = require('fs');
const path = require('path');
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
      let p = null;

      try{
        if (!product.item)
          { throw new Error('ERROR: no product item defined' ); };
        if (!product.type)
          { throw new Error('ERROR: no product type defined' ); };
        if (!product.unit)
          { throw new Error('ERROR: no product unit defined' ); };

        p = JSON.parse(JSON.stringify(product));

        const timeStamp = Date.now();

        // delete(p.id);
        p.price = p.price || 0;
        p.quantity = p.quantity || 1;
        p.createdAt = timeStamp;
        p.updatedAt = timeStamp;

        const [item, created] = await db.item.findOrCreate({
          where: { title: p.item,
            deletedAt: { [Sequelize.Op.is]: null  },
          },
          defaults: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            deletedAt: null,
          },
        });
        if (created){
          console.log(`INFO: entity item with id ${item.id} was created`);;
        }
        p.itemId = item.id;

        const [typeItem, typeCreated] = await db.type.findOrCreate({
          where: { title: p.type,
            deletedAt: { [Sequelize.Op.is]: null  },
          },
          defaults: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            deletedAt: null,
          },
        });
        if (typeCreated){
          console.log(`INFO: entity type with id ${typeItem.id} was created`);;
        }
        p.typeId = typeItem.id;

        // const res = await db.product.create(p);
        const [productItem, productCreated] = await db.product.findOrCreate({
          where: {
            [Sequelize.Op.and]:
              [
                { itemId: p.itemId },
                { typeId: p.typeId },
                { unit: p.unit },
                // { price: product.price }, { quantity: product.quantity },
              ],
              deletedAt: { [Sequelize.Op.is]: null }
          },
          defaults: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            deletedAt: null,
            unit: p.unit,
            price: p.price || 0,
            quantity: p.quantity || 1,
            itemId: p.itemId,
            typeId: p.typeId,
          },
        });
        if (productCreated){
          // eslint-disable-next-line max-len
          console.log(`INFO: entity product with id ${productItem.id} was created`);;
        }

      } catch (err){
        console.error(err.message || err);
        throw err;
      };

      return p;
    },

    getProduct: async (id) => {
      try{
        if (!id){ throw new Error('ERROR: no product id defined' ); };

        const res = await db.product.findOne({
          where: {
            id,
            deletedAt: { [Sequelize.Op.is]: null }
          },
          include: [{ all: true }]
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

    getAllProducts: async (objWhere) => {
      if (!objWhere){ throw new Error('ERROR: no product filter defined' ); };
      try{

        const res = await db.product.findAll({ include: [{ all: true }]});
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

        const res = await db.product.update(product, {
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

    updateOrCreateProduct: async (product, done) => {

      if (!Object.keys(product).length){
        const err = new Error('ERROR: Nothing to update' );
        done(err, false);
        return false;
      }

      try {
        const p = JSON.parse(JSON.stringify(product));
        const timeStamp = Date.now();
        p.price = p.price || 0;
        p.quantity = p.quantity || 1;
        p.createdAt = timeStamp;
        p.updatedAt = timeStamp;

        const [item, created] = await db.item.findOrCreate({
          where: { title: p.item,
            deletedAt: { [Sequelize.Op.is]: null  },
          },
          defaults: {
            createdAt: timeStamp,
            updatedAt: timeStamp,
            deletedAt: null,
          },
        });
        if (created){
          console.log(`INFO: entity item with id ${item.id} was created`);
        }
        p.itemId = item.id;

        const [typeItem, typeCreated] = await db.type.findOrCreate({
          where: { title: p.type,
            deletedAt: { [Sequelize.Op.is]: null  },
          },
          defaults: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            deletedAt: null,
          },
        });
        if (typeCreated){
          console.log(`INFO: entity type with id ${typeItem.id} was created`);;
        }
        p.typeId = typeItem.id;

        const [productItem, productCreated] = await db.product.findOrCreate({
          where: {
            [Sequelize.Op.and]:
              [
                { itemId: p.itemId },
                { typeId: p.typeId },
                { unit: p.unit },
                // { price: product.price }, { quantity: product.quantity },
              ],
              deletedAt: { [Sequelize.Op.is]: null }
          },
          defaults: {
            createdAt: timeStamp,
            updatedAt: timeStamp,
            deletedAt: null,
            unit: p.unit,
            price: p.price || 0,
            quantity: p.quantity || 1,
            itemId: p.itemId,
            typeId: p.typeId,
          },
        });
        if (productCreated){
          // eslint-disable-next-line max-len
          console.log(`INFO: entity product with id ${productItem.id} was created`);
          done(null, JSON.stringify(productItem));
        } else {
          productItem.set('price',
            Number(productItem.get('price')) + Number(product.price));
          productItem.set('quantity',
            Number(productItem.get('quantity')) + Number(product.quantity));

          await productItem.save();
          // eslint-disable-next-line max-len
          console.log(`INFO: entity product with id ${productItem.id} was updated`);
          done(null, JSON.stringify(productItem));
        }
      } catch (err){
        console.error(err.message || err);
        done(err, '!!! ERROR Product.save');
        throw err;
      };

      return true;
    },

    checkAndCreateItemOrder: async (product, userId, done) => {

      if (!Object.keys(product).length){
        const err = new Error('ERROR: Nothing to update' );
        done(err, false);
        return false;
      }

      try {
        const p = JSON.parse(JSON.stringify(product));
        const timeStamp = Date.now();
        p.price = p.price || 0;
        p.quantity = p.quantity || 1;
        p.createdAt = timeStamp;
        p.updatedAt = timeStamp;

        const resProduct = await db.product.findOne({
          where: {
            unit: p.unit,
            deletedAt: { [Sequelize.Op.is]: null }
          },
          include: [{
            model: db.item,
            where: {
              deletedAt: { [Sequelize.Op.is]: null },
              title: p.item,
            }
          },
          {
            model: db.type,
            where: {
              deletedAt: { [Sequelize.Op.is]: null },
              title: p.type,
            }
          }]
        });

        if (!resProduct){
          console.log(`ERROR: product ${JSON.stringify(p)} not found`);
          done('ERROR: product not found', JSON.stringify(p));
          return true;
        };
        if (Number(resProduct.get('quantity')) < p.quantity){
          console.log(`ERROR: product ${JSON.stringify(p)} not enough`);
          done(`ERROR: product not enough. Balance ${resProduct.get('quantity')}`, JSON.stringify(p));
          return true;
        };

        const resUser = await db.user.findOne({
          where: {
            id: userId,
            deletedAt: { [Sequelize.Op.is]: null }
          }
        });
        if (!resUser){
          done('ERROR: user not found', JSON.stringify({ id: userId }));
          return true;
        }

        const objOrder = {
          title: 'order number ',
          productId: resProduct.get('id'),
          quantity: p.quantity,
          createdAt: timeStamp,
          updatedAt: timeStamp,
          userId: resUser.get('id'),
        };

        const resOrder = await db.order.create(objOrder);
        resProduct.set('quantity',
          Number(resProduct.get('quantity')) - Number(p.quantity));
        await resProduct.save();

        console.log(
          `INFO: new item by order created ${JSON.stringify(resOrder)}. Balance ${Number(resProduct.get('quantity'))}`
        );
        done(null, JSON.stringify(resOrder));

      } catch (err){
        console.error(err.message || err);
        done(err, '!!! ERROR order.save');
        throw err;
      };

      return true;
    },


    deleteProduct: async (id) => {
      try{
        if (!id){ throw new Error('ERROR: no product id defined' ); };

        // const res = await db.Product.destroy({ where: {id} });
        const res =
          await db.product.update({ deletedAt: Date.now() }, { where: {id} });

        console.log(
          `INFO: product by id ${JSON.stringify(id)} was deleted`
        );

        return res[0];

      } catch (err){
        console.error(err.message || err);
        throw err;
      };
    },

    findUsersEmail: async (userEmail) => {
      try{
        if (!userEmail){ throw new Error('ERROR: no email id defined' ); };

        const res = await db.user.findOne({
          where: {
            email: userEmail,
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

    createUser: async (user) => {

      const timeStamp = Date.now();

      const cloneUser = JSON.parse(JSON.stringify(user));
      cloneUser.lastLoginDt = timeStamp;
      cloneUser.nickname = cloneUser.email;

      const res = await db.user.create(cloneUser);
      return res;
    },


  };
};
