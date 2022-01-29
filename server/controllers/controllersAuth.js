const bcrypt = require('bcrypt');
const ApiError = require('../error/ApiError');
const db = require('../db');
const userValidation = require('../validations/userValidation');


const registerPost = async (req, res, next) => {

  try{
    const {error} = userValidation.registerValidation(req.body);
    if(error) next(ApiError.badRequest(error.message || error));

    // Check if the email is already in the database
    const emailExist =
      await db.dbWrapper().findUsersEmail({email: req.body.email});
    if(emailExist)
      next(ApiError.badRequest('The email is already registered.'));

    // Hash the password
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(req.body.password, salt);

    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || '',
      nickname: req.body.nickname || ''
    };

    const result = db.dbWrapper().createUser(user);
    res.json(result);
  }catch(err){
    next(ApiError.notImplemented(err.message || err));
  }
};

module.exports = {
  registerPost,

};
