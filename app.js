const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./controllers/user");
const { requireAuth } = require("./middleware/user");

const app = express();

// Veritabanına bağlanmak için Mongoose kullanın
mongoose.connect("mongodb://localhost/mydatabase", { useNewUrlParser: true });
mongoose.connection.on("error", (error) => console.log(error));
mongoose.connection.once("open", () => console.log("Database connected!"));

app.use(bodyParser.json());
app.use("/users/login", requireAuth, userRoutes);
app.use("/users/register", userRoutes);

// Sunucu başlat
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

app.get("/", (req, res) => {
  res.send("Merhaba Dünya!");
});
