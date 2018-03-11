const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../../config').jwtSecret;
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

  User.authenticate(req.body.email, req.body.password, (err, user) => {
    if (err) return next(err);
    if (err === null && !user) {
      const error = new Error('User dont exist!');
      error.status = 500;
      return next(error);
    } else {
      const payload = {
        id: user._id
      }
      const token = jwt.sign(payload, jwtSecret, {
        expiresIn: 86400
      });
      res.json({ token: token });

    }

  })
  // res.render('helo', { login: req.body.email, password: req.body.password });
})

module.exports = router;

const userExists = (username) => {

}