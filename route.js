const express = require("express");
const seeders = require("./seeders/seedersRoute");
const userRoute = require("./modules/user/userRoute");
const adminRoute = require("./modules/admin/adminRoute");

// Routes Path

const app = express.Router();

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/seeders", seeders);
app.use("/api/v1/admin", adminRoute);
app.all("/*", (req, res) =>
  res.status(404).json({ message: "Invalid Request" })
);

module.exports = app;
