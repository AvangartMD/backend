const express = require("express");
const UserCtr = require("./userController");
const UserMiddleware = require("./userMiddleware");
const Auth = require("../../helper/auth");
const auth = require("../../helper/auth");

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

// list all user for admin only

const list = [auth.isAuthenticatedUser, auth.isAdmin, UserCtr.list];
userRoute.get("/list", list);

// get user details
const getDetails = [auth.isAuthenticatedUser, UserCtr.getUserDetails];
userRoute.get("/userDetails", list);

module.exports = userRoute;
