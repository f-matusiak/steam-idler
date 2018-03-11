const express = require('express');
const router = express.Router();
const user = require('../models/user');
const request = require('request');
const steamApiKey = require('../../config').steamApiKey;

router.get('/', (req, res, next) => {
  res.redirect(`/games/${req.decoded.id}`);
})

router.get('/:id', (req, res, next) => {
  user.findById(req.decoded.id, (err, user) => {
    if (err) return next(err)
    if (!user) {
      const error = new Error('User not found!');
      error.status = 401;
      return next(error);
    }

    const data = {
      profileName: user.profileName,
      imageUrl: user.imageUrl,
      apps: user.apps,
      logged: true
    };

    res.render('games', data);

  })
})

router.post('/:id/update', (req, res, next) => {

  user.findById(req.decoded.id, (err, user) => {
    if (err) return next(err)
    if (!user) {
      const error = new Error('User not found!');
      error.status = 401;
      return next(error);
    }

    request(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${steamApiKey}&steamid=${user.steamID64}&include_appinfo=1`, (error, response, body) => {

      if (err) {
        return next(err);
      } else if (!body) {
        return res.json({ error: 'Error: couldnt fetch data' });
      }

      const data = JSON.parse(body);
      if (data.response && data.response.games && data.response.games.length > 0) {
        const apps = [];
        data.response.games.forEach((game) => {
          apps.push({
            appId: game.appid,
            name: game.name,
            imageUrl: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
            playtime: game.playtime_forever
          });
        });
        user.apps = apps;
        user.save((err) => {
          if (err) return next(err);
          res.json({ success: 'Congrats!' });
        })
      } else {
        res.json({ error: 'User have no games!' });
      }

    })

  })
})


module.exports = router;