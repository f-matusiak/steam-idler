const express = require('express');
const router = express.Router();
const User = require('../models/user');
const steamUser = require('steam-user');

router.get('/', (req, res, next) => {
  res.redirect(`/profile/${req.decoded.id}`);
})

router.get('/:id', (req, res, next) => {
  User.findOne({ _id: req.decoded.id }, (err, user) => {
    if (err) return next(new Error('Error user can not be found'));
    if (!user) {
      return next(new Error('specified user dont exist!'));
    } else if (req.decoded.id === req.params.id) {
      const data = {
        text: user.username,
        token: req.cookies.token
      }

      data.password = user.password;
      res.render('profile', data);
    } else {
      console.log('Profile: ', req.params.id);
      res.render('profile', { text: `it's not your profile xD` });
    }

  })

});

router.post('/:id/setid', (req, res, next) => {
  if (req.body.steamID64) {
    if (req.params.id === req.decoded.id) {
      User.updateSteamID(req.decoded.id, req.body.steamID64, (err, user) => {
        if (err) return next(err);
        res.json({ success: 'SteamID64 change successfully' });
      })
    } else {
      res.json({ error: 'You cant change data of another user!!!' });
    }
  }
});

module.exports = router;