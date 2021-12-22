const ApiError = require('../error/ApiError');

module.exports = ((req, res, next) => {

  const auth = {login: 'Masters', password: 'Academy'};

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] =
    Buffer.from(b64auth, 'base64').toString().split(':');

  // Verify login and password are set and correct
  if (login && password && login === auth.login && password === auth.password) {
    // Access granted...
    return next();
  }

  return next(ApiError.authenticationRequired('Authentication required.'));
});
