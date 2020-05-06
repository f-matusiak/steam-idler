const express = require("express");
const router = express.Router();
const User = require("../models/user");
const SteamUser = require("steam-user");

const clients = {};

router.get("/", (req, res, next) => {
  res.render("bot");
});

router.post("/start", (req, res, next) => {
  if (!req.body.appId || !req.decoded.id || !clients[req.decoded.id]) {
    const error = new Error("Something went wrong");
    error.status = 401;
    return next(error);
  }

  clients[req.decoded.id].setPersona(SteamUser.EPersonaState.Online);
  clients[req.decoded.id].gamesPlayed(Number(req.body.appId));
});

router.post("/logout", (req, res, next) => {
  clients[req.decoded.id].logOff();
  delete clients[req.decoded.id];

  res.json({ success: "success" });
});

router.post("/login", (req, res, next) => {
  User.findOne({ where: { id: req.decoded.id } })
    .then((user) => {
      const { steamLogin, steamPassword } = user;
      const client = new SteamUser();

      client.logOn({
        accountName: steamLogin,
        password: steamPassword,
        twoFactorCode: req.body.auth,
      });

      client.on("loggedOn", () => {
        console.log("Logged into Steam");

        client.setPersona(SteamUser.EPersonaState.Online);
        clients[req.decoded.id] = client;
        res.json({ success: "logged in successfully" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
