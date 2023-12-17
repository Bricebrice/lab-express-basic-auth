const bcrypt = require("bcrypt");
const saltRounds = 10;

const express = require("express");
const router = express.Router();

const User = require("../models/User.model");

// ****************************************************************************************
// GET route to display the form to signup
// ****************************************************************************************
router.get("/signup", (req, res) => res.render("auth/signup"));

// ****************************************************************************************
// POST route to create the user
// ****************************************************************************************
router.post("/signup", (req, res, next) => {
  // console.log("req.body", req.body);
  const { username, password } = req.body;

  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      console.log("hash", hash);
      return User.create({ username, password: hash });
    })
    .then((user) => {
      console.log("user", user);

      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
