const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
// const authHandler = require('./middleware/authMiddleware');
const router = require('./routes/index');
// const { port, db: dbConfig } = require('./config');
const { port } = require('./config');
const {registerPost} = require('./controllers/controllersAuth');


// const db = require('./db')(dbConfig);

const db = require('./db');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'server')));

router.post('/register', registerPost) ;

// router.post('/login', async (request, response) => {
//   try
//   {
//       const {error} = userValidation.loginValidation(request.body);
//       if(error) return response.status(400).json(error);

//       const user = await User.findOne({ email: request.body.email });
//       if(!user) return response.status(404).send('Email or password is not valid.');

//       const validPassword = await bcrypt.compare(request.body.password, user.password);
//       if(!validPassword) return response.status(404).send('Email or password is not valid.');

//       // Create Token
//       const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET);
//       response.header('auth_token', token);
//       return response.json({ auth_token: token });
//   } catch(err){
//       console.log(err);
//       response.status(501).json(err);
//   }
// });


// app.use(authHandler);



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
