import { requireAuth } from "../middleware/user";
const express = require("express");
const bodyParser = require("body-parser");
const Bilet = require("../models/bilet");

const router = express.Router();
router.use(bodyParser.json());

router.post("/biletler", async (req, res) => {
  const { seferId, yolcu, koltuklar } = req.body;

  if (!seferId || !yolcu || !koltuklar) {
    return res
      .status(400)
      .json({ message: "Sefer, yolcu ve koltuk bilgileri gereklidir" });
  }

  if (!Array.isArray(koltuklar)) {
    return res.status(400).json({ message: "Koltuklar bir dizi olmalıdır" });
  }

  if (koltuklar.length === 0) {
    return res.status(400).json({ message: "En az bir koltuk seçmelisiniz" });
  }

  const genders = koltuklar.map((koltuk) => koltuk.cinsiyet);
  const isGenderMatched = genders.every((gender) => gender === genders[0]);

  if (!isGenderMatched) {
    return res.status(400).json({
      message: "Aynı bilete erkek ve kadın koltukları ekleyemezsiniz",
    });
  }

  if (koltuklar.length > 5) {
    return res
      .status(400)
      .json({ message: "En fazla 5 koltuk seçebilirsiniz" });
  }

  const reservedSeats = await Bilet.find({ seferId });
  const reservedSeatNumbers = reservedSeats.reduce(
    (seatNumbers, reservedSeat) => {
      return seatNumbers.concat(
        reservedSeat.koltuklar.map((koltuk) => koltuk.koltukNumarasi)
      );
    },
    []
  );

  for (const koltuk of koltuklar) {
    if (!koltuk.koltukNumarasi || !koltuk.cinsiyet) {
      return res
        .status(400)
        .json({ message: "Koltuk numarası ve cinsiyet bilgileri gereklidir" });
    }

    if (reservedSeatNumbers.includes(koltuk.koltukNumarasi)) {
      return res
        .status(400)
        .json({ message: "Seçilen koltuklar müsait değil" });
    }

    reservedSeatNumbers.push(koltuk.koltukNumarasi);
  }

  const yeniBilet = new Bilet({
    seferId: seferId,
    koltuklar: koltuklar,
  });

  try {
    const kaydedilenBilet = await yeniBilet.save();
    return res.status(200).json(kaydedilenBilet);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Bir hata oluştu" });
  }
});

router.get("/biletlerim", requireAuth, async (req, res) => {
  try {
    const biletler = await Bilet.find({ userId: req.user._id }).populate(
      "seferId"
    );
    return res.status(200).json(biletler);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Bir hata oluştu" });
  }
});

router.get("/biletDetay", async (req, res) => {
  try {
    const biletler = await Bilet.find();
    const biletDetaylari = [];

    for (const bilet of biletler) {
      const sefer = await Sefer.findById(bilet.seferId);

      for (const koltuk of bilet.koltuklar) {
        const detay = {
          kalkisSehri: sefer.kalkisSehri,
          varisSehri: sefer.varisSehri,
          saat: sefer.saat,
          koltukNumarasi: koltuk.koltukNumarasi,
          yolcuAdi: koltuk.yolcuAdi,
          cinsiyet: koltuk.cinsiyet,
        };

        biletDetaylari.push(detay);
      }
    }

    return res.status(200).json(biletDetaylari);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Bir hata oluştu" });
  }
});

module.exports = router;
