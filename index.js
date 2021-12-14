const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const { env } = require('process');
require('dotenv').config();
const routes = require('./server/routes');
const { handleStreamRoutes } = require('./server/routesStream');

const {PORT} = env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(basicAuth({
  users: { 'Masters': 'Academy' },
  unauthorizedResponse: getUnauthorizedResponse
}));
function getUnauthorizedResponse(req) {
  return req.auth
      ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
      : 'No credentials provided'
}
app.put('/store/csv', handleStreamRoutes);
app.use('/', routes);
app.use((req, res, next) => {
  next({
      status: 404,
      message: 'Not Found',
  });
});
app.use((err, req, res, next) => {
  if (err.status) res.sendStatus(err.status);
  next();
});

app.listen(port=PORT || 3000, () => {
  console.log(`Server successfully started on port ${port}`);
});

module.exports = {app};