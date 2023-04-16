const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
