const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const csrf = require("csurf");
const passport = require("passport");
const csrfProtection = csrf();
router.use(csrfProtection);

router.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("profile");
});
router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect("/");
});

router.use("/", notLoggedIn, function (req, res, next) {
  next();
});

//sign up routes
router.get("/signup", (req, res) => {
  const messages = req.flash("error");
  res.render("signup.pug", {
    title: "Sign Up",
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});
router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signup",
    failureFlash: true,
  })
);

//sign in routes
router.get("/signin", (req, res) => {
  const messages = req.flash("error");
  res.render("signin.pug", {
    title: "Sign in",
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signin",
    failureFlash: true,
  })
);

module.exports = router;
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
