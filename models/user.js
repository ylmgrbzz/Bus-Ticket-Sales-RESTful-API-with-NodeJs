const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  age: { type: Number },
  gender: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
