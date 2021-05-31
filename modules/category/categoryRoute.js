const express = require("express");
const CategoryCtr = require("./categoryController");
const CategoryMiddleware = require("./categoryMiddleware");
const Auth = require("../../helper/auth");

const categoryRoute = express.Router();

// add New category
const addNewCategory = [
  Auth.isAuthenticatedUser,
  Auth.isAdmin,
  CategoryMiddleware.validateAddMiddleware,
  CategoryMiddleware.checkCategoryAlreadyAdded,
  CategoryCtr.addNewCategory,
];
categoryRoute.post("/add", addNewCategory);

// update category
const updateCategory = [
  Auth.isAuthenticatedUser,
  Auth.isAdmin,
  CategoryMiddleware.validateUpdate,
  CategoryMiddleware.checkCategoryAlreadyAddedForUpdate,
  CategoryCtr.updateCategory,
];
categoryRoute.put("/update/:id", updateCategory);

// list category

const listCategory = [CategoryCtr.list];
categoryRoute.get("/list", listCategory);

module.exports = categoryRoute;
