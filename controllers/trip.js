const express = require("express");
const bodyParser = require("body-parser");
const Trip = require("../models/trip");

const router = express.Router();
router.use(bodyParser.json());

// 6. Şehirlere göre seferleri listeleyen endpoint
router.get("/trips/:from/:to", async (req, res) => {
  const { from, to } = req.params;

  try {
    const trips = await Trip.find({ from, to });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 7. Seferleri saat saat listeleme
router.get("/trips/:from/:to/:date", async (req, res) => {
  const { from, to, date } = req.params;

  try {
    const trips = await Trip.find(
      { from, to, date },
      { time: 1, _id: 0, price: 1 }
    );
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 8. Sefer detaylarını listeleme
router.get("/trip/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const trip = await Trip.findById(id);
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// 9. Detaylı sefer bilgisi endpointi
router.get("/trips/:id/details", async (req, res) => {
  const { id } = req.params;

  try {
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: "Sefer bulunamadı" });
    }

    const detailedInfo = trip.getDetailedInfo();
    res.json(detailedInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/trips/:from/:to/details", async (req, res) => {
  const { from, to } = req.params;

  try {
    const trips = await Trip.find({ from, to });
    const result = trips.map((trip) => {
      const { _id, from, to, date, time, price, seats } = trip;
      const availableSeats = seats.filter((seat) => !seat.isBooked);
      const bookedSeats = seats.filter((seat) => seat.isBooked);
      const maleSeats = bookedSeats.filter((seat) => seat.gender === "male");
      const femaleSeats = bookedSeats.filter(
        (seat) => seat.gender === "female"
      );

      return {
        _id,
        from,
        to,
        date,
        time,
        price,
        totalSeats: seats.length,
        availableSeats: availableSeats.length,
        bookedSeats: bookedSeats.length,
        maleSeats: maleSeats.length,
        femaleSeats: femaleSeats.length,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
