const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const router = require('./routes/index');
const { port } = require('./config');
const db = require('./db');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'server')));
app.use(cookieParser());

app.use('/', router);
app.use(errorHandler);

const start = async () => {
  try {
    await db.init();
    db.setType('sequelize');
    console.log(`Now db is ${db.getType()}`);

    app.listen(port, () =>
        console.log(`Server successfully started on port ${port}`));
  } catch (e) {
      console.log(e);
  }
};

start();
