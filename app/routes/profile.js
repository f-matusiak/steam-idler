const express = require('express');
const router = express.Router();
const User = require('../models/user');
const steamUser = require('steam-user');

router.get('/', (req, res, next) => {
  const data = {
    text: req.decoded.username,
    token: req.cookies.token
  }
  User.findOne({ username: req.decoded.username }, (err, user) => {
    if (err) return next(new Error('Error user can not be found'));
    data.password = user.password;
    res.render('profile', { data });
  })

});

router.post('/', (req, res, next) => {
  if (read.body && req.body.steamID64) {
    User.updateOne({ username: req.decoded.username }, {
      $set: {
        steamID: req.body.steamID64
      }
    });
    res.json({ success: 'Steam id set successfully' });
  }
});

module.exports = router;