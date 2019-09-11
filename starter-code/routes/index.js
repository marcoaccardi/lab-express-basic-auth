const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const user = req.session.user;
  res.render("index", { user });
  // res.render("index");
});

router.get("/private", (req, res) => {
  if (req.session.user) {
    const user = req.session.user;
    //render private view
    res.render("private", { user: user });
  } else {
    res.redirect("/login");
  }
});

router.get("/main", (req, res) => {
  if (req.session.user) {
    const user = req.session.user;
    res.render("main", { user });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
