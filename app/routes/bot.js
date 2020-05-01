const express = require("express");
const router = express.Router();
const user = require("../models/user");
const steamUser = require("steam-user");

router.get("/", (req, res, next) => {
  res.redirect(`/${req.decoded.id}`);
});

router.post("/:id/:appid", (req, res, next) => {
  user.getParams(req.decoded.id, params, (err, data) => {
    if (err) return next(err);
    if (!data) {
      const error = new Error("Database didnt respond");
      error.status = 401;
      return next(error);
    }
  });
});

module.exports = router;
