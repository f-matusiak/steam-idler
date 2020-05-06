const express = require("express");
const router = express.Router();
const User = require("../models/user");
const request = require("request");
const steamApiKey = require("../../config").steamApiKey;

router.get("/", (req, res, next) => {
  User.findOne({ where: { id: req.decoded.id } })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found!");
        error.status = 401;
        return next(error);
      }
      const data = {
        profileName: user.profileName,
        imageUrl: user.imageUrl,
        apps: user.apps || [],
        logged: true,
      };

      res.render("games", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/update", (req, res, next) => {
  User.findOne({ where: { id: req.decoded.id } })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found!");
        error.status = 401;
        return next(error);
      }

      request(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${steamApiKey}&steamid=${user.steamID64}&include_appinfo=1`,
        (error, response, body) => {
          if (error) {
            return next(err);
          } else if (!body) {
            return res.json({ error: "Error: couldnt fetch data" });
          }

          const data = JSON.parse(body);
          if (
            data.response &&
            data.response.games &&
            data.response.games.length > 0
          ) {
            const apps = [];
            data.response.games.forEach((game) => {
              apps.push({
                appId: game.appid,
                name: game.name,
                imageUrl: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
                playtime: game.playtime_forever,
              });
            });
            user.update({ apps });
            res.json({ success: "Congrats!" });
          } else {
            res.json({ error: "User have no games!" });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
