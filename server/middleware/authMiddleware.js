
// module.exports = ((req, res, next) => {

//   const auth = {login: 'Masters', password: 'Academy'};

//   // parse login and password from headers
//   const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
//   const [login, password] =
//     Buffer.from(b64auth, 'base64').toString().split(':');

//   // Verify login and password are set and correct
//   if (login && password && login === auth.login && password === auth.password) {
//     // Access granted...
//     return next();
//   }

//   return next(ApiError.authenticationRequired('Authentication required.'));
// });

const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
const authorize = (roles = []) => (req, res, next) => {
  try
  {
      const token = req.header('Authorization');
      if(!token) return res.status(401).send('Access denied.');

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      // eslint-disable-next-line max-len
      req.user = verified; // set the request "authorized" property with the validation result

      if(roles.length > 0 && !verified.roles.some(r => roles.includes(r))){
          return res.status(401).send('Access Denied');
      }

      next();
  } catch(err) {
      console.log(err);
      return res.status(501).json(err);
  }
};

module.exports = authorize;
