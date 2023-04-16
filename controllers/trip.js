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
