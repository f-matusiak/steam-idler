const express = require('express');
const router = express.Router;
const User = require('../models/user');
router.get('/', (req, res) => {
  res.render('register');
});

router.post('/', (req, res, next) => {
  if (!req.body.username || !req.body.password || !req.body.passwordConfirm || !req.body.email) {
    res.render('register', { error: 'You have to fill all fields!' });
  } else {
    const userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    };

    User.create(userData, (err, user) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/profile');
      }
    });
  }
})