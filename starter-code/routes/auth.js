// SETTINGS
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// ROUTING GET
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

//ROUTING POST
router.post("/signup", (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;
  //check if the password is long enough
  if (password.length < 8) {
    return res.render("signup", {
      errMessage: "your password must be 8 char min."
    });
  }
  // if the password is empty go to signup page
  if (username === "") {
    return res.render("signup", {
      errMessage: "Your username cannot be empty"
    });
  }

  // if username exists in the DB render a message in the signup
  User.findOne({ username: username }).then(found => {
    console.log("found: ", found);
    if (found) {
      res.render("signup", { errMessage: "this username is already taken" });
    } else {
      // we can create a user with the username and password pair
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      //if the username doesn't exists in the DB, create a username and an encrypted password
      User.create({ username: username, password: hash })
        .then(dbUser => {
          req.session.user = dbUser;
          res.redirect("/");
        })
        .catch(err => {
          next(err);
        });
    }
  });
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }).then(found => {
    // if user is not in the DB render login and display a message
    if (found === null) {
      res.render("login", { errMessage: "invalid credentials" });
      return;
    }
    // if user is in the DB compare the encrypted password in the DB with the password typed
    if (bcrypt.compareSync(password, found.password)) {
      // if password and hash match go to the index page
      req.session.user = found;
      res.redirect("/");
    } else {
      //if hash and password don't match go to login page and display a message
      res.render("login", { errMessage: "invalid credential" });
    }
  });
});

module.exports = router;
