const express = require("express");
const bodyParser = require("body-parser");
const Trip = require("../models/ticket");

app.post("/biletler", async (req, res) => {
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

  for (const koltuk of koltuklar) {
    if (!koltuk.koltukNumarasi || !koltuk.cinsiyet) {
      return res
        .status(400)
        .json({ message: "Koltuk numarası ve cinsiyet bilgileri gereklidir" });
    }
  }

  const eslesmeBilet = await Bilet.findOne({
    sefer: seferId,
    "koltuklar.koltukNumarasi": koltuk.koltukNumarasi,
  });

  if (eslesmeBilet) {
    return res.status(400).json({
      message:
        "Seçilen koltuklar müsait değil veya cinsiyet kısıtlamalarına uygun değil",
    });
  }

  if (koltuklar.length > 5) {
    return res
      .status(400)
      .json({ message: "En fazla 5 koltuk seçebilirsiniz" });
  }

  const yeniBilet = new Bilet({
    sefer: seferId,
    yolcu: yolcu,
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
