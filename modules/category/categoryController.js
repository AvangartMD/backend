const CategoryModel = require("./categoryModel");
const Utils = require("../../helper/utils");
const { query } = require("winston");
const CategoryCtr = {};

// add new category
CategoryCtr.addNewCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const createNewCategory = new CategoryModel({
      categoryName: name,
      slugText: name,
    });

    await createNewCategory.save();

    return res.status(200).json({
      message: req.t("CATEGORY_ADDED"),
      status: true,
    });
  } catch (err) {
    Utils.echoLog("error in creating user ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// update category
CategoryCtr.updateCategory = async (req, res) => {
  try {
    const getCategoryDetails = await CategoryModel.findById(req.params.id);

    if (getCategoryDetails) {
      if (req.body.name) {
        getCategoryDetails.name = req.body.name;
        getCategoryDetails.slugText = req.body.name;
      }
      if (!req.body.status) {
        getCategoryDetails.status = false;
      }
      if (req.body.status) {
        getCategoryDetails.status = true;
      }

      await getCategoryDetails.save();

      return res.status(200).json({
        message: req.t("CATEGORY_UPDATED"),
        status: true,
      });
    } else {
      return res.status(400).json({
        message: req.t("INVALID_CATEGORY"),
        status: true,
      });
    }
  } catch (err) {
    Utils.echoLog("error in creating user ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// list category
CategoryCtr.list = async (req, res) => {
  try {
    let query = { isActive: true };
    if (req.query.list === "all") {
      query = {};
    }
    const list = await CategoryModel.find(query);
    return res.status(200).json({
      message: req.t("CATEGORY_LIST"),
      status: true,
      data: list,
    });
  } catch (err) {
    Utils.echoLog("error in listing  user ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

module.exports = CategoryCtr;
