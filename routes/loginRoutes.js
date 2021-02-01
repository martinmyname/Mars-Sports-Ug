const express = require("express");
const router = express.Router();
const passport = require("passport");
const roles = require("../roles");

//login page for agric officer
router.get("/", (req, res) => {
  res.render("loginAO.pug", { title: "Login form" });
});

//agric officer sign in
router.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    const userRole = roles[req.user.role];

    if (userRole == "admin") {
      res.redirect("/users/farmerOnes");
    } else userRole == "farmer";
    {
      res.redirect("/users/admin");
    }
  }
);
module.exports = router;
