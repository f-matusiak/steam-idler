const express = require('express');
const router = express.Router();
const user = require('../models/user');

router.get('/', (req, res, next) => {
  res.redirect(`/config/${req.decoded.id}`);
})

router.get('/:id', (req, res, next) => {

  const params = [
    'steamLogin',
    'profileName',
    'imageUrl'
  ];

  user.getParams(req.decoded.id, params, (err, data) => {
    if (err) return next(err)
    if (!data) {
      return next(new Error('No data received from database'));
    }
    data.steamLogin = data.steamLogin || 'Username...';
    data.logged = true;
    res.render('userconfig', data);

  });
})

router.post('/:id/update', (req, res, next) => {
  if (req.body.username && req.body.password) {
    const data = {
      username: req.body.username,
      password: req.body.password
    }
    user.updateSteamCredentials(req.decoded.id, data, (err, user) => {
      if (err) return next(err);
      if (!user) {
        return next(new Error('user not found'));
      }
      res.json({ success: 'user credentials updated' });
    })
  } else {
    res.json({ error: 'You have to provide username and password!' });
  }
})

module.exports = router;