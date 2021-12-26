// const { config } = require('dotenv');
const { Pool } = require('pg');

module.exports = (config) => {
  const client = new Pool(config);

  return {
    testConnection: async () => {
      try{
        console.log('hello from pg testConnection');
        await client.query('SELECT NOW()');
      } catch (err) {console.error(err.stack);
        throw err;
      };
    },

    close: async () => {
      console.log('INFO closing pg');
      client.end();
    },

    createProduct: async ({item, type, unit, price = 0, quantity = 1}) => {
      try{
        if (!item){ throw new Error('ERROR: no product item defined' ); };
        if (!type){ throw new Error('ERROR: no product type defined' ); };
        if (!unit){ throw new Error('ERROR: no product unit defined' ); };

        const timeStamp = new Date();

        const res = await client.query(
          'INSERT INTO products'
            + '(item, type, unit, price, quantity, created_at, updated_at)'
            + ' VALUES ($1, $2, $3, $4, $5, $6, $7)'
          , [item, type, unit, price, quantity, timeStamp, timeStamp]
        );

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

        const res = await client.query(
          'SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL', [id]);

        console.log(
          `INFO: product by id ${JSON.stringify(res.rows[0])}`
        );

        return res.rows[0];

      } catch (err){
        console.error(err.message || err);
        throw err;
      };
    },

    // updateProduct: async ({id, ...product}) => {
    updateProduct: async (id, product) => {
      try{
        if (!id){ throw new Error('ERROR: no product id defined' ); };

        const query = [];
        const values = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const [index, [key, val]] of Object.entries(product).entries()){
          query.push(`${key} = $${index + 1}`);
          values.push(val);
        };

        if (!values.length){
          throw new Error('ERROR: nothing to update' );
        }

        values.push(id);

        const res = await client.query(
          `UPDATE products SET ${query.join(',')}`
          +` WHERE id =  $${values.length}`
          +' RETURNING *', values);

        console.log(
          `DEBUG: product updates ${JSON.stringify(res.rows[0])}`
        );

      } catch (err){
        console.error(err.message || err);
        throw err;
      };
    },

    deleteProduct: async (id) => {
      try{
        if (!id){ throw new Error('ERROR: no product id defined' ); };

        const res = await client.query(
          'UPDATE products SET deleted_at = $1 WHERE id = $2',
          [new Date(), id]
        );

        console.log(
          `INFO: product by id ${JSON.stringify(res.rows[0])}`
        );

        return res.rows[0];

      } catch (err){
        console.error(err.message || err);
        throw err;
      };
    },

  };
};
