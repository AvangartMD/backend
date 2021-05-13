const express = require("express");
const UserCtr = require("./userController");
const UserMiddleware = require("./userMiddleware");
const Auth = require("../../helper/auth");

const userRoute = express.Router();
// get roles
const getAllRoles = [UserCtr.getAllRoles];
userRoute.get("/getRoles", getAllRoles);

// update user
const updateUserDetails = [
  Auth.isAuthenticatedUser,
  UserMiddleware.signUpValidator,
  UserCtr.updateUserDetails,
];
userRoute.put("/update", updateUserDetails);

// login user
const login = [UserMiddleware.loginValidator, UserCtr.login];
userRoute.post("/login", login);

module.exports = userRoute;
