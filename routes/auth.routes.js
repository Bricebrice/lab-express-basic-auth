const bcrypt = require("bcrypt");
const saltRounds = 10;

const express = require("express");
const router = express.Router();

const User = require("../models/User.model");

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

// ****************************************************************************************
// GET route to display the form to signup
// ****************************************************************************************
router.get("/signup", isLoggedOut, (req, res) => res.render("auth/signup"));

// ****************************************************************************************
// POST route to create the user
// ****************************************************************************************
router.post("/signup", isLoggedOut, (req, res, next) => {
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
      res.redirect("/userProfile");
    })
    .catch((err) => console.log(err));
});

// ****************************************************************************************
// GET route to display the profile page
// ****************************************************************************************
router.get("/userProfile", isLoggedIn, (req, res) =>
  res.render("users/user-profile", { userInSession: req.session.currentUser })
);

// ****************************************************************************************
// GET route to display the form to login
// ****************************************************************************************
router.get("/login", isLoggedOut, (req, res) => res.render("auth/login"));

// ****************************************************************************************
// POST route to login the user
// ****************************************************************************************
router.post("/login", isLoggedOut, (req, res) => {
  console.log("SESSION =====> ", req.session);

  console.log("req.body", req.body);
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      console.log("user", user);
      // console.log("password", password);
      // console.log("user password", user.password);

      // if user doesn't exist, display message
      if (!user) {
        console.log("Username not registered. ");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
        return;
        // if there's a user, compare the encrypted pwd with provided and render user-profile page with data
      } else if (bcrypt.compareSync(password, user.password)) {
        console.log("req.session: ", req.session);

        // res.render("users/user-profile", { user });
        req.session.currentUser = user;
        console.log("req.session.currentUser: ", req.session.currentUser);
        res.redirect("/userProfile");
        // if pwd doesn't match, display message
      } else {
        console.log("Incorrect password. ");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
      }
    })
    .catch((err) => console.log(err));
});

// ****************************************************************************************
// POST route to logout the user
// ****************************************************************************************
router.post("/logout", isLoggedOut, (req, res) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
