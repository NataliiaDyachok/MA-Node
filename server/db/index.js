/* eslint-disable import/no-dynamic-require */
const {
  db: { config, defaultType }
} = require('../config');

const { fatal } = require('../error/ApiError');

const db = {};
let type = defaultType;

const funcWrapper = (func) =>
  typeof func === 'function' ?
    func :
    fatal(`FATAL: cannot find ${func.name} function for this DB wrapper`);

const init = async () => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const [ k, v ] of Object.entries(config)){
      // eslint-disable-next-line import/no-dynamic-require
      // eslint-disable-next-line global-require
      const wrapper = require(`./${k}`)(v);
      // eslint-disable-next-line no-await-in-loop
      await wrapper.testConnection();
      console.log(`INFO: DB wrapper for ${k} initiated`);
      db[k] = wrapper;
    }

  } catch (error) {
    fatal(`FATAL: ${error.message || error}`);
  }
};

const end = async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [ k, v ] of Object.entries(db)){
    // eslint-disable-next-line no-await-in-loop
    await v.close();
    console.log(`INFO: DB wrapper for ${k} closed`);
  }
};

const setType = (t) => {
  if (!t || !db[t]){
    console.log('WARNINNG: Cannot find provided DB type');
    return false;
  }

  // eslint-disable-next-line no-const-assign
  type = t;
  console.log(`INFO: The DB type has been changed to ${t}`);
  return true;
};

const getType = () => type;

const dbWrapper = (t) => db[t] || db[type];

module.exports = {
  init,
  end,
  setType,
  getType,
  dbWrapper,

  testConnection: async () => funcWrapper(dbWrapper.testConnection)(),
  close: async () => funcWrapper(dbWrapper.close)(),
  createProduct:
    async (product) => funcWrapper(dbWrapper.createProduct)(product),
  getProduct: async (id) => funcWrapper(dbWrapper.getProduct)(id),
  updateProduct:
    async (product) => funcWrapper(dbWrapper.updateProduct)(product),
  deleteProduct: async (id) => funcWrapper(dbWrapper.deleteProduct)(id),
};
