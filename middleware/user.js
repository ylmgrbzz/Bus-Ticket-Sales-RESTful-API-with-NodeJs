const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, "mysecretkey", (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Geçersiz token." });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Yetkilendirme başarısız." });
  }
};

module.exports = { requireAuth };
