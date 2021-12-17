const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const authHandler = require('./middleware/authMiddleware');
const router = require('./routes/index');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'server')));

app.use(authHandler);
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
