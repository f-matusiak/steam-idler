module.exports = {
  requiresLogin: (req, res, next) => {
    if (req.session && req.session.username) {
      return next();
    } else {
      const err = new Error('You have to be logged to enter this page!');
      err.status = 401;
      return next(err);
    }
  }
};