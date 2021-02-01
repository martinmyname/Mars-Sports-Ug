const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/registration.js");
require("../models/MarsSportsUgReg.js");

const FarmerOne = mongoose.model("FarmerOne");
const admin = mongoose.model("admin");

//add router for registaring farmerOne
router.get("/regFarmerOne", (req, res) => {
  res.render("regFarmerOne", { title: "FarmerOne registration" });
});

router.get("/regUrbanFarmer", (req, res) => {
  res.render("regUrbanFarmer", { title: "Urban Farmer registration" });
});

//post the data from the regFarmerOne form to the DB
router.post("/regFarmerOne", (req, res) => {
  console.log(req.body);
  const farmerOne = new FarmerOne(req.body);
  farmerOne
    .save()
    .then(() => {
      res.redirect("/users/farmerOnes");
    })
    .catch((err) => {
      console.log(err);
      res.send("sorry something went wrong.");
    });
});

//after importing "/users" then navigate to "/"
router.get("/farmerOnes", (req, res) => {
  FarmerOne.find()
    .then((farmerOne) => {
      res.render("farmerOnes", {
        title: "MarsSportsUg Farmer Ones ",
        farmerOne,
      });
    })
    .catch(() => {
      res.send("sorry something went wrong");
    });
});

//post the data from the regUrbanFarmer form to the DB
router.post("/regUrbanFarmer", (req, res) => {
  console.log(req.body);
  const Admin = new admin(req.body);
  Admin.save()
    .then(() => {
      res.redirect("/users/admin");
    })
    .catch((err) => {
      console.log(err);
      res.send("sorry something went wrong.");
    });
});

//after importing "/users" then navigate to "/"
router.get("/admin", (req, res) => {
  admin
    .find()
    .then((admin) => {
      res.render("admin", {
        title: "MarsSportsUg Urban Farmers ",
        admin,
      });
    })
    .catch(() => {
      res.send("sorry something went wrong");
    });
});

//updating farmer one details.
router.get("/update/:id", async (req, res) => {
  try {
    const updateUser = await FarmerOne.findOne({ _id: req.params.id });
    res.render("updateFO", { farmer: updateUser });
  } catch (err) {
    res.status(400).send("Unable to find farmerOne in the database");
  }
});

router.post("/update", async (req, res) => {
  try {
    await FarmerOne.findOneAndUpdate({ _id: req.query.id }, req.body);
    res.redirect("farmerOnes");
  } catch (err) {
    res.status(404).send("Unable to update farmerOne in the database");
  }
});

//updating urban farmer details
router.get("/update/uf/:id", async (req, res) => {
  try {
    const updateUserUF = await admin.findOne({ _id: req.params.id });
    res.render("updateUF", { farmer: updateUserUF });
  } catch (err) {
    res.status(400).send("Unable to find farmerOne in the database");
  }
});

router.post("/update/uf", async (req, res) => {
  try {
    await admin.findOneAndUpdate({ _id: req.query.id }, req.body);
    res.render("admin.pug");
  } catch (err) {
    res.status(404).send("Unable to update Urban Farmer in the database");
  }
});
module.exports = router;
