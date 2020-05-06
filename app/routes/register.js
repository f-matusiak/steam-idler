const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res, next) => {
  res.render("register", { title: "Register" });
});

router.post("/", (req, res, next) => {
  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.passwordConfirm ||
    !req.body.email
  ) {
    res.render("register", { error: "You have to fill all fields!" });
  } else if (req.body.password !== req.body.passwordConfirm) {
    res.render("register", { error: "password dont match!" });
  } else {
    const userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      steamID64: "",
    };

    User.create(userData)
      .then((user) => {
        return res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = router;
