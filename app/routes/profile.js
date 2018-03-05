const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('profile', { text: req.decoded.username, token: req.cookies.token });
});

module.exports = router;