require('dotenv').config({path: 'server/.env'});
const ApiError = require('../error/ApiError');

const config = {
  port: process.env.PORT || 3000,
  db: {
    defaultType: process.env.DB_WRAPPER_TYPE  || 'sequelize',
    config: {
      pg: {
        user: process.env.DB_USER || ApiError.fatal('DB_USER is not defined'),
        host: process.env.DB_HOST || ApiError.fatal('DB_HOST is not defined'),
        port: process.env.DB_PORT || ApiError.fatal('DB_PORT is not defined'),
        database: process.env.DB_NAME ||
          ApiError.fatal('DB_NAME is not defined'),
        password: process.env.DB_PASS ||
          ApiError.fatal('DB_PASS is not defined'),
      },

      sequelize: {
        dialect: 'postgres',
        username: process.env.DB_USER ||
          ApiError.fatal('DB_USER is not defined'),
        host: process.env.DB_HOST || ApiError.fatal('DB_HOST is not defined'),
        port: process.env.DB_PORT || ApiError.fatal('DB_PORT is not defined'),
        database: process.env.DB_NAME ||
          ApiError.fatal('DB_NAME is not defined'),
        password: process.env.DB_PASS ||
          ApiError.fatal('DB_PASS is not defined'),
        // logging: true,
        logging: console.log,
        pool: {
          min: 0,
          max: 10,
          idle: 5000,
          acquire: 5000,
          evict: 5000,
        }
      }
    }
  }
};

module.exports = config;
