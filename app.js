const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./controllers/user");
const { requireAuth } = require("./middleware/user");
const tripRoutes = require("./controllers/trip");
const ticket = require("./controllers/ticket");

const app = express();

mongoose.connect("mongodb://localhost/mydatabase", { useNewUrlParser: true });
mongoose.connection.on("error", (error) => console.log(error));
mongoose.connection.once("open", () => console.log("Database connected!"));

app.use(bodyParser.json());
// app.use("/users/login", requireAuth);
// app.use("/users", userRoutes);

app.use("/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/tickets", ticket);

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
