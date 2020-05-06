const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = require("../../config").jwtSecret;
// Steam
const SteamUser = require("steam-user");
// ---

router.get("/", (req, res) => {
  res.render("login", { title: "Login" });
});

router.post("/", (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    const err = new Error("Pass login and password!!");
    err.status = 400;
    return next(err);
  }

  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.status = 401;
        return next(error);
      }

      if (user.validPassword(req.body.password)) {
        const payload = {
          id: user.id,
        };
        const token = jwt.sign(payload, jwtSecret, {
          expiresIn: 86400,
        });
        return res.json({ token: token });
      }
      return res.sendStatus(403);
    })
    .catch((err) => {
      console.log(err);
    });
  // res.render('helo', { login: req.body.email, password: req.body.password });
});

module.exports = router;
