const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
require('dotenv').config();
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const router = require('./routes/index');
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
app.use(errorHandler);

const start = () => {
  try {
      app.listen(PORT, () =>
        console.log(`Server successfully started on port ${PORT}`));
  } catch (e) {
      console.log(e);
  }
};

start();

