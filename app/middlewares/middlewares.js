const jwt = require('jsonwebtoken');

module.exports = {
  requiresLogin: (req, res, next) => {
    const token = req.body.token || req.cookies.token;

    if (token) {
      jwt.verify(token, 'superSecret', (err, decoded) => {
        if (err) {
          return next(new Error('Failed to authenticate token!'));
        } else {
          req.decoded = decoded;
          next();
        }
      })
    } else {
      return next(new Error('You have to provide a token!'));
    }
  }
};