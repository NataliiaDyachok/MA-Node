const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
require('dotenv').config();
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

const router = require('./routes/index');
// const routes = require('./routes/routes');
// const { handleStreamRoutes } = require('./routes/routesStream');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

const getUnauthorizedResponse = (req) => req.auth
      ? (`Credentials ${  req.auth.user  }:${  req.auth.password  } rejected`)
      : 'No credentials provided';

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'server')));

app.use(basicAuth({
  users: { 'Masters': 'Academy' },
  unauthorizedResponse: getUnauthorizedResponse
}));

app.use('/', router);

// app.put('/store/csv', handleStreamRoutes);
// app.use('/', routes);

app.use(errorHandler);

// next(ApiError.badRequest(e.message))

const start = () => {
  try {
      app.listen(PORT, () =>
        console.log(`Server successfully started on port ${PORT}`));
  } catch (e) {
      console.log(e);
  }
};

start();

