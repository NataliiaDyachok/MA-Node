const ApiError = require('../error/ApiError');

// eslint-disable-next-line no-unused-vars
module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message});
    }
    return res.status(500).json({message: 'Unexpected error!'});
};
