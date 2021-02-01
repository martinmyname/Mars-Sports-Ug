const express = require("express");
const router = express.Router();
var fs = require("fs");
var multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
require("../models/uploadProduct.js");
const product = mongoose.model("product");
// mongoose.Promise = global.Promise;
const bodyParser = require("body-parser");

router.get("/upload", (req, res) => {
  res.render("upload.pug", { title: "upload product" });
});

router.use(bodyParser.urlencoded({ extended: true }));
// router.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Define the photo paths
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

//Post data to the home route.
// router.post("/", (req, res) => {
//   console.log(req.body);
//   const myProduct = new product(req.body);
//   myProduct
//     .save()
//     .then(() => {
//       res.redirect("/");
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send("something went wrong,");
//     });
// });

//Option 2 for posting image
router.post("/", upload.single("image"), (req, res, next) => {
  const myProduct = new product({
    product_id: req.body.product_id,
    product_name: req.body.product_name,
    color: req.body.color,
    produce_type: req.body.produce_type,
    price: req.body.price,
    directions: req.body.directions,
    stock: req.body.stock,
    Mode_of_payment: req.body.Mode_of_payment,
    Mode_of_delivery: req.body.Mode_of_delivery,
    phone: req.body.phone,
    image: req.file.filename,
  });
  myProduct
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.send("something went wrong, product not saved");
    });
});

//MarsSportsUg home page route.
router.get("/", (req, res) => {
  product
    .find()
    .then((product) => {
      res.render("index.pug", { title: "Mars Sports Ug", product });
    })
    .catch(() => {
      res.send("sorry something went wrong.");
    });
});

//router for search bar
router.get("/productList", async (req, res) => {
  try {
    let items = await product.find();
    if (req.query.product_name) {
      items = await product.find({ product_name: req.query.product_name });
    }
    res.render("index", { title: "Product list", product: items });
  } catch (err) {
    res.status(400).send("Unable to find Product in the database");
  }
});

//route to the checkout page
router.get("/checkout/:id", async (req, res) => {
  try {
    const checkout = await farmerOne.findOne({ _id: req.params.id });
    res.render("checkout.pug", { farmer: checkout });
  } catch (err) {
    res.status(400).send("Unable to find farmer in the database");
  }
});

module.exports = router;
