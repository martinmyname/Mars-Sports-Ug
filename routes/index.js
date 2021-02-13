const express = require("express");
const router = express.Router();
var fs = require("fs");
var multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
require("../models/uploadProduct.js");
var Cart = require("../models/cart");
var Order = require("../models/order");

const product = mongoose.model("product");
// const session = require("express-session");

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

//Option 2 for posting image
router.post("/", upload.single("image"), (req, res, next) => {
  const myProduct = new product({
    product_id: req.body.product_id,
    product_name: req.body.product_name,
    color: req.body.color,
    produce_type: req.body.produce_type,
    price: req.body.price,
    description: req.body.description,
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

router.get("/add-to-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  product.findById(productId, function (err, Product) {
    cart.add(Product, Product.id);
    req.session.cart = cart;
    res.redirect("/");
  });
});

//reducing items in the cart routes
router.get("/reduce/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});
//removing items in the cart routes
router.get("/remove/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

//checkout routes
router.get("/shopping-cart", (req, res, next) => {
  if (!req.session.cart) {
    return res.render("shopping-cart", { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render("shopping-cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
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

router.get("/checkout", isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash("error")[0];
  res.render("checkout", {
    total: cart.totalPrice,
    errMsg: errMsg,
    noError: !errMsg,
  });
});

router.post("/checkout", isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  // var cart = new Cart(req.session.cart);

  var order = new Order({
    user: req.user,
    cart: req.session.cart,
    address: req.body.address,
    name: req.body.name,
    // paymentId: charge.id,
  });
  order.save(function (err, result) {
    req.flash("success", "Successfully bought product!");
    req.session.cart = null;
    res.redirect("/");
  });
});

module.exports = router;
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect("/user/signin");
}
