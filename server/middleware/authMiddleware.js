const basicAuth = require('express-basic-auth');

const getUnauthorizedResponse = (req) => req.auth
  ? (`Credentials ${  req.auth.user  }:${  req.auth.password  } rejected`)
  : 'No credentials provided';

module.exports = basicAuth({
  users: { 'Masters': 'Academy' },
  unauthorizedResponse: getUnauthorizedResponse
});
