const mongoose = require("mongoose");
const Trip = require("../models/trip");

mongoose.connect("mongodb://localhost/mydatabase", { useNewUrlParser: true });

const cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Adana"];
const trips = [
  {
    from: "İstanbul",
    to: "Ankara",
    date: "2023-04-30",
    time: "09:00",
    price: 50,
  },
  {
    from: "İstanbul",
    to: "İzmir",
    date: "2023-05-01",
    time: "10:00",
    price: 70,
  },
  {
    from: "Ankara",
    to: "İstanbul",
    date: "2023-05-01",
    time: "12:00",
    price: 50,
  },
  { from: "Ankara", to: "İzmir", date: "2023-05-02", time: "14:00", price: 80 },
  { from: "İzmir", to: "Ankara", date: "2023-05-03", time: "08:00", price: 70 },
  { from: "İzmir", to: "Bursa", date: "2023-05-04", time: "11:00", price: 40 },
  { from: "Bursa", to: "Adana", date: "2023-05-05", time: "13:00", price: 90 },
  {
    from: "Adana",
    to: "İstanbul",
    date: "2023-05-06",
    time: "15:00",
    price: 120,
  },
];
async function seedDatabase() {
  for (let i = 0; i < trips.length; i++) {
    const { from, to, date, time, price } = trips[i];
    const trip = new Trip({ from, to, date, time, price, seats: [] });
    await trip.save();
  }

  console.log("Database seeded!");
  mongoose.disconnect();
}

seedDatabase();
