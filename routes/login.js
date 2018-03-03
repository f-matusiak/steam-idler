const express = require('express');
const router = express.Router();

// Steam
const SteamUser = require('steam-user');
// ---

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', (req, res, next) => {
  if (!req.body.login || !req.body.password) {
    const err = new Error('Pass login and password!!');
    err.status = 400;
    next(err);
  }
  // const userInfo = userExists(req.body.login);
  // if (userInfo === false) {
  //   const userData = {
  //     username: req.body.login,
  //     password: req.body.password
  //   }


  // } else if (typeof userInfo !== 'boolean') {

  // } else {
  //  // createUser(req.body);
  // }
  res.render('helo', { login: req.body.login, password: req.body.password });
})

module.exports = router;

const userExists = (username) => {

}