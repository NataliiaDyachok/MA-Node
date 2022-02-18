/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
const db = require('../db');
const userValidation = require('../validations/userValidation');

const registerPost = async (req, res, next) => {

  try{
    const {error} = userValidation.registerValidation(req.body);
    if(error) {
      next(ApiError.badRequest(error.message || error));
      return;
    }

    // Check if the email is already in the database
    const emailExist =
      await db.dbWrapper().findUsersEmail(req.body.email);
    if(emailExist) {
      next(ApiError.badRequest('The email is already registered.'));
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(req.body.password, salt);

    const user = {
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || '',
      email: req.body.email,
      password: hashPassword
    };

    const result = await db.dbWrapper().createUser(user);
    res.json(result);
  }catch(err){
    next(ApiError.notImplemented(err.message || err));
  }
};

const loginPost = async (req, res, next) => {
  try {
    const {error} = userValidation.loginValidation(req.body);
    if(error) {
      next(ApiError.badRequest(error.message || error));
      return;
    }

    const user =
      await db.dbWrapper().findUsersEmail(req.body.email);
    if(!user) {
      next(ApiError.badRequest('Email or password is not valid.'));
      return;
    }

    const validPassword =
      await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
      next(ApiError.badRequest('Email or password is not valid.'));
      return;
    }

    // Create Token
    const token =
      jwt.sign({ id: user.id, roles: [] },
          process.env.ACCESS_TOKEN_SECRET,
          {expiresIn: process.env.ACCESS_EXPIRES_IN});

    const refreshToken =
      jwt.sign({ id: user.id, roles: [] },
        process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: process.env.REFRESH_EXPIRES_IN});

    await db.dbWrapper().createRefreshToken(user.id, refreshToken);

    // Set jwt refresh token in cookie as 'refresh_token'
    res.cookie('refresh_token', refreshToken, {
      // maxAge: 365 * 24 * 60 * 60 * 100, // session only cookie
      maxAge: process.env.REFRESH_EXPIRES_IN,
      httpOnly: true // cannot be modified using XSS or JS
    });

    const response = {
        'status': 'Logged in',
        'token': token,
        'refreshToken': refreshToken,
    };

    res.header('auth_token', token);
    res.json(response);

  } catch(err) {
    console.log(err);
    next(ApiError.notImplemented(err.message || err));
  }
};

const refreshPost = async (req, res, next) => {
  try {

    const { refresh_token } = req.cookies;
    if (!refresh_token){
      next(ApiError.authenticationRequired('Access denied.'));
      return;
    }

    const verified = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    if (!verified || !verified.id){
      next(ApiError.authenticationRequired('Access denied.'));
      return;
    }

    const token =
      jwt.sign({ id: verified.id, roles: [] },
          process.env.ACCESS_TOKEN_SECRET,
          {expiresIn: process.env.ACCESS_EXPIRES_IN});

    const refreshToken =
      jwt.sign({ id: verified.id, roles: [] },
        process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: process.env.REFRESH_EXPIRES_IN});

    await db.dbWrapper().createRefreshToken(verified.id, refreshToken);

    // Set jwt refresh token in cookie as 'refresh_token'
    res.cookie('refresh_token', refreshToken, {
      // maxAge: 365 * 24 * 60 * 60 * 100, // session only cookie
      maxAge: process.env.REFRESH_EXPIRES_IN,
      httpOnly: true // cannot be modified using XSS or JS
    });

    const response = {
        'status': 'refresh token',
        'token': token,
        'refreshToken': refreshToken,
    };

    res.header('auth_token', token);
    res.json(response);


  } catch(err) {
    console.log(err);
    next(ApiError.notImplemented(err.message || err));
  }
};

module.exports = {
  registerPost,
  loginPost,
  refreshPost,
};
