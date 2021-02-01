const mongoose = require("mongoose");

const MarsSportsUgSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  idnumber: String,
  stock: String,
  gender: String,
  dateOfReg: Date,
  dateOfBirth: Date,
  NIN: String,
  phone: Number,
});

module.exports = mongoose.model("admin", MarsSportsUgSchema);
