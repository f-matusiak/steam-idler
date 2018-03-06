const express = require('express');
const router = express.Router();
const User = require('../models/user');
const steamUser = require('steam-user');

router.get('/', (req, res, next) => {
  res.redirect(`/profile/${req.decoded.username}`);
})

router.get('/:username', (req, res, next) => {
  User.findOne({ username: req.decoded.username }, (err, user) => {
    if (err) return next(new Error('Error user can not be found'));
    if (req.decoded.username === req.params.username) {
      const data = {
        text: req.decoded.username,
        token: req.cookies.token
      }

      data.password = user.password;
      res.render('profile', data);
    } else {
      console.log('Profile: ', req.params.username);
      res.render('profile', { text: `it's not your profile xD` });
    }

  })

});

router.post('/:username/setid', (req, res, next) => {
  if (req.body && req.body.steamID64) {
    console.log(req.params.username);
    if (req.params.username === req.decoded.username) {
      User.findOneAndUpdate({ username: req.decoded.username }, {

        steamID64: String(req.body.steamID64)

      }
        .exec((err, user) => {
          if (err) return next(new Error('error while adding steamID64'));
          console.log(user);
          res.json({ success: 'Steam id set successfully' });
        }));
    } else {
      res.json({ error: 'You cant change data of another user!!!' });
    }

  }
});

module.exports = router;