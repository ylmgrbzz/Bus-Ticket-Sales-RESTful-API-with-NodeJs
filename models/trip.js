const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
  seats: [
    {
      seatNumber: { type: Number, required: true },
      isOccupied: { type: Boolean, required: true },
      gender: { type: String, enum: ["male", "female", null] },
    },
  ],
});

// Detaylı sefer bilgisi metodunu ekle
tripSchema.methods.getDetailedInfo = function () {
  const { from, to, date, time, price, seats } = this;
  return { from, to, date, time, price, seats };
};
tripSchema.methods.bookSeat = async function (seatNumber, passengerName) {
  if (!this.seats.includes(seatNumber)) {
    throw new Error("gecersiz koltuk numarası");
  }

  const index = this.seats.indexOf(seatNumber);
  if (this.seats[index].length !== 0) {
    throw new Error("koltuk zaten rezerve edilmiş");
  }

  this.seats[index] = passengerName;
  await this.save();
};

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
