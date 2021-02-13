const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const csrf = require("csurf");
const passport = require("passport");
const csrfProtection = csrf();
router.use(csrfProtection);
var Cart = require("../models/cart");
var Order = require("../models/order");

router.get("/profile", isLoggedIn, function (req, res, next) {
  Order.find({ user: req.user }, function (err, orders) {
    if (err) {
      return res.write("Error!");
    }
    var cart;
    orders.forEach(function (order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render("profile", { orders: orders });
  });
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
    failureRedirect: "/user/signup",
    failureFlash: true,
  }),
  function (req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/user/profile");
    }
  }
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
    failureRedirect: "/user/signin",
    failureFlash: true,
  }),
  function (req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/user/profile");
    }
  }
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
