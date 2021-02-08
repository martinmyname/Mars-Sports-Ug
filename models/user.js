const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
// const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
userSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
// userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
