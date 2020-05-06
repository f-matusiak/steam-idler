const express = require("express");
const router = express.Router();
const User = require("../models/user");
const steamApiKey = require("../../config").steamApiKey;
const request = require("request");

router.get("/", (req, res, next) => {
  if (req.decoded.id) {
    User.findOne({ where: { id: req.decoded.id } })
      .then((user) => {
        const data = {
          profileName: user.profileName,
          imageUrl: user.imageUrl,
          profileUrl: user.profileUrl,
          steamID64: user.steamID64,
          token: req.cookies.token,
          logged: true,
        };

        res.render("profile", data);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.render("profile", { text: `it's not your profile xD` });
  }
});

// Games page after passing id parameter in url in profile path!!!

router.post("/setid", (req, res, next) => {
  if (req.body.steamID64) {
    if (req.decoded.id) {
      User.findOne({ where: { id: req.decoded.id } })
        .then((user) => {
          if (!user) {
            return next(new Error("user not found"));
          }
          user.update({
            steamID64: req.body.steamID64,
          });
          res.json({ success: "SteamID64 changed" });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.json({ error: "Another user is using this steamID" });
    }
  }
});

router.post("/update", (req, res, next) => {
  if (req.decoded.id) {
    User.findOne({ where: { id: req.decoded.id } })
      .then((user) => {
        const steamID64 = user.steamID64;
        request(
          `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamID64}`,
          (error, response, body) => {
            if (error) {
              return next(error);
            } else if (!body) {
              return res.json({ error: "Error: couldnt fetch data" });
            }
            const data = JSON.parse(body);
            if (
              data.response &&
              data.response.players &&
              data.response.players.length >= 1
            ) {
              const d = data.response.players[0];

              user.update({
                profileName: d.personaname,
                profileUrl: d.profileurl,
                imageUrl: d.avatarfull,
              });
            }
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.json({ error: "error while updating profile" });
  }
});

module.exports = router;
