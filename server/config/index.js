require('dotenv').config({path: 'server/.env'});
const ApiError = require('../error/ApiError');

const config = {
  port: process.env.PORT || 3000,
  db: {
    user: process.env.DB_USER || ApiError.fatal('DB_USER is not defined'),
    host: process.env.DB_HOST || ApiError.fatal('DB_HOST is not defined'),
    port: process.env.DB_PORT || ApiError.fatal('DB_PORT is not defined'),
    database: process.env.DB_NAME || ApiError.fatal('DB_NAME is not defined'),
    password: process.env.DB_PASS || ApiError.fatal('DB_PASS is not defined'),
  }
};

module.exports = config;
