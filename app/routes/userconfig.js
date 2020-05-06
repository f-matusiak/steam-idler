const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", (req, res, next) => {
  User.findOne({ where: { id: req.decoded.id } })
    .then((user) => {
      const data = {
        profileName: user.profileName,
        imageUrl: user.imageUrl,
        steamLogin: user.profileUrl || "Username...",
        logged: true,
      };

      res.render("userconfig", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/update", (req, res, next) => {
  if (req.body.username && req.body.password) {
    User.findOne({ where: { id: req.decoded.id } })
      .then((user) => {
        user.update({
          steamLogin: req.body.username,
          steamPassword: req.body.password,
        });
        res.json({ success: "user credentials updated" });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.json({ error: "You have to provide username and password!" });
  }
});

module.exports = router;
