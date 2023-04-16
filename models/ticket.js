const mongoose = require("mongoose");

const biletSchema = new Schema({
  seferId: {
    type: Schema.Types.ObjectId,
    ref: "Sefer",
    required: true,
  },
  koltuklar: [
    {
      koltukNumarasi: {
        type: Number,
        required: true,
      },
      yolcuAdi: {
        type: String,
        required: true,
      },
      cinsiyet: {
        type: String,
        enum: ["Erkek", "Kadın"],
        required: true,
      },
    },
  ],
});

const Bilet = mongoose.model("Bilet", biletSchema);
