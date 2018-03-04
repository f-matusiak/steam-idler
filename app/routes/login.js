const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
// Steam
const SteamUser = require('steam-user');
// ---

router.get('/', (req, res) => {
  res.render('login', { title: "Login" });
});

router.post('/', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    const err = new Error('Pass login and password!!');
    err.status = 400;
    return next(err);
  }

  const query = { email: req.body.email };
  User.findOne(query, (err, user) => {
    if (err) return next(err);
    if (!user) {
      res.render('login', { error: "User dont exist!" });
    } else if (user) {
      if (user.passwordConfirm !== req.body.password) {
        res.render('login', { title: 'Login', error: 'Wrong password!' });
      } else {
        const payload = {
          username: user.username
        }
        const token = jwt.sign(payload, 'superSecret', {
          expiresIn: 86400
        });
        if (req.body.token) {
          res.render('profile');
        } else {
          res.render('login', { error: token });
        }

      }
    }
  })
  // res.render('helo', { login: req.body.email, password: req.body.password });
})

module.exports = router;

const userExists = (username) => {

}