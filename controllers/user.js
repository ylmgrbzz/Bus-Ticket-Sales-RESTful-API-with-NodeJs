const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { requireAuth } = require("../middleware/user");

const router = express.Router();
router.use(bodyParser.json());

router.post("/register", async (req, res) => {
  const { name, age, gender, email, phone, password } = req.body;
  if (!name || !age || !gender || !email || !phone || !password) {
    return res.status(400).json({ message: "Lütfen tüm alanları doldurunuz." });
  }

  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res
      .status(409)
      .json({ message: "Bu e-posta adresi kullanılmaktadır." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    age,
    gender,
    email,
    phone,
    password: hashedPassword,
  });

  try {
    await user.save();
    res.status(201).json({ message: "Kayıt başarılı." });
  } catch (error) {
    res.status(400).json({ message: "Kayıt sırasında bir hata oluştu." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "geçersiz email yada şifre" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "geçersiz email yada şifre" });
    }

    const token = jwt.sign({ id: user._id }, "mysecretkey");

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
