const jwt = require('jsonwebtoken');
const jwtSecret = require('../../config').jwtSecret;
module.exports = {
  requiresLogin: (req, res, next) => {
    const token = req.body.token || req.cookies.token;

    if (token) {
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          return next(new Error('Failed to authenticate token!'));
        } else {
          req.decoded = decoded;
          next();
        }
      })
    } else {
      return next(new Error('Please log in!'));
    }
  }

};