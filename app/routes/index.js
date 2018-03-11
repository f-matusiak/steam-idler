const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* GET home page. */
router.get('/', function (req, res) {

  const data = {
    title: 'Steam Idler'
  }

  data.logged = req.cookies.token ? true : false;

  User.count({}, (err, count) => {
    if (err) {
      data.numberOfUsers = 'Error';
      res.render('index', data);
    } else {
      data.numberOfUsers = count;
      res.render('index', data);
    }
  })


});

module.exports = router;
