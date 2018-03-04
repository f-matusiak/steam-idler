const express = require('express');
const router = express.Router();

// OLD --- need to change session.destroy into something like JWT destroy?
// now without logout option :P

router.get('/', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;