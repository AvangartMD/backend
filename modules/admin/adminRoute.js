const express = require("express");
const AdminCtr = require("./adminController");
const AdminMiddleware = require("./adminMiddleware");
const bannerRoute = require("./banner/bannerRoute");
const Auth = require("../../helper/auth");

const adminRoute = express.Router();
// get roles
const addNewAdmin = [
  AdminMiddleware.validateAdd,
  AdminMiddleware.checkAlreadyAdded,
  AdminCtr.addNewAdmin,
];
adminRoute.post("/add", addNewAdmin);

// login admin
const login = [AdminMiddleware.validateLogin, AdminCtr.login];
adminRoute.post("/login", login);

// banner route
adminRoute.use("/banner", bannerRoute);

module.exports = adminRoute;
