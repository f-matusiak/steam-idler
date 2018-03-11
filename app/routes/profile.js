const express = require('express');
const router = express.Router();
const User = require('../models/user');
const steamApiKey = require('../../config').steamApiKey;
const request = require('request');

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
        token: req.cookies.token,
        logged: true
      }

      if (user.profileName) data.profileName = user.profileName;
      if (user.imageUrl) data.imageUrl = user.imageUrl;
      if (user.profileUrl) data.profileUrl = user.profileUrl;
      if (user.apps && user.apps.length > 0) data.apps = user.apps;
      data.steamID64 = user.steamID64 ? user.steamID64 : 'Enter steamID64';

      res.render('profile', data);
    } else {
      res.render('profile', { text: `it's not your profile xD` });
    }

  })

});

// Games page after passing id parameter in url in profile path!!!

router.post('/:id/setid', (req, res, next) => {
  if (req.body.steamID64) {
    if (req.params.id === req.decoded.id) {
      User.updateSteamID(req.decoded.id, req.body.steamID64, (err, user) => {
        if (err) return next(err);
        if (!user) {
          return next(new Error('user not found'));
        }
        res.json({ success: 'SteamID64 changed' });
      });
      // UPDATE APPS and profile
    } else {
      res.json({ error: 'Another user is using this steamID' });
    }
  }
});

router.post('/:id/update', (req, res, next) => {

  if (req.params.id === req.decoded.id) {

    User.findById(req.decoded.id, (err, user) => {
      if (err) {
        return next(err);
      }

      const steamID64 = user.steamID64;
      request(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamID64}`, (error, response, body) => {

        if (err) {
          return next(err);
        } else if (!body) {
          return res.json({ error: 'Error: couldnt fetch data' });
        }
        const data = JSON.parse(body);
        if (data.response && data.response.players && data.response.players.length >= 1) {

          const d = data.response.players[0];
          user.profileName = d.personaname;
          user.profileUrl = d.profileurl;
          user.imageUrl = d.avatarfull;

          user.save((err) => {
            if (err) return next(err);
            res.json({ success: 'Congrats!' });
          });
        }
      })
    })


  } else {
    res.json({ error: 'error while updating profile' })
  }
})

module.exports = router;