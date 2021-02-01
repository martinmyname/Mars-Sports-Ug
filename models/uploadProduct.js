const mongoose = require("mongoose");

const upload = new mongoose.Schema({
  product_id: String,
  product_name: String,
  color: String,
  produce_type: String,
  price: Number,
  directions: String,
  stock: String,
  Mode_of_payment: String,
  Mode_of_delivery: String,
  phone: String,
  image: String,
});

module.exports = mongoose.model("product", upload);
