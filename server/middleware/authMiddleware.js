const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');

const authorize = (req, res, next) => {
  try
  {
    const authHeader = req.header('Authorization');
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    if(!token)
      return next(ApiError.authenticationRequired('Access denied.'));

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // eslint-disable-next-line max-len
    req.user = verified; // set the request "authorized" property with the validation result

    // if(roles.length > 0 && !verified.roles.some(r => roles.includes(r))){
    //   return next(ApiError.authenticationRequired('Access denied.'));
    // }
    return next();

  } catch(err) {
    console.log(err);
    return next(ApiError.notImplemented(err.message || err));
  }
};

module.exports = { authorize };
