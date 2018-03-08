const express = require('express');
const router = express.Router();
const User = require('../models/user');
const steamUser = require('steam-user');
const steamApiKey = require('../../config').steamApiKey;
const https = require('https');

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
        if (!user) {
          return next(new Error('user not found'));
        }
        res.json({ success: 'SteamID64 change and profile updated successfully' });
      });
      // UPDATE APPS and profile
    } else {
      res.json({ error: 'You cant change data of another user!!!' });
    }
  }
});

router.post('/:id/update', (req, res, next) => {
  if (req.params.id === req.decoded.id) {
    const data = {};
    let json = '';
    https.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${req.decoded.id}`, (response) => {
      response.on('data', (chunk) => {
        json += chunk;
      });

      response.on('end', () => {
        const temp = JSON.parse(json).response.players[0];
        data.profileName = temp.personaname;
        data.profileUrl = temp.profileurl;
        data.imageUrl = temp.avatarfull;


      });
    });
    let json2 = '';
    https.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${steamApiKey}&steamid=${req.decoded.id}&include_appinfo=1`, (response) => {
      response.on('data', (chunk) => {
        json2 += chunk;
      });

      response.on('end', () => {
        const temp = JSON.parse(json2).response.games;
        const games = [];
        temp.forEach((game) => {
          games.push({
            appId: game.appid,
            name: game.name,
            imageUrl: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
            playtime: game.playtime_forever
          });
        });
        data.apps = games;
      });
    });
    User.findByIdAndUpdate(req.decoded.id, data, (err, user) => {
      if (err) {
        return next(err);
      } else if (!user) {
        return next(new Error('user not found'));
      }
      res.json({ success: 'Bravo!' });
    })
  }
})

module.exports = router;