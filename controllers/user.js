const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();
router.use(bodyParser.json());

app.post("/register", async (req, res) => {
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Lütfen tüm alanları doldurunuz." });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(401).json({ message: "Kullanıcı bulunamadı." });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Hatalı şifre." });
  }

  const accessToken = jwt.sign({ email: user.email }, "mysecretkey");
  res.status(200).json({ accessToken: accessToken });
});
