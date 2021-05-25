const Joi = require("joi");
const validate = require("../../helper/validateRequest");
const RolesModel = require("../roles/rolesModal");
const UserModel = require("./userModal");
const UserMiddleware = {};

UserMiddleware.signUpValidator = (req, res, next) => {
  const portfolioSchema = Joi.object().keys({
    instagarm: [Joi.string().optional(), Joi.allow(null)],
    facebook: [Joi.string().optional(), Joi.allow(null)],
    github: [Joi.string().optional(), Joi.allow(null)],
    twitter: [Joi.string().optional(), Joi.allow(null)],
    website: [Joi.string().optional(), Joi.allow(null)],
  });

  const schema = Joi.object({
    name: Joi.string(),
    surname: Joi.string(),
    isCreator: Joi.boolean().required(),
    portfolio: portfolioSchema,
  });
  validate.validateRequest(req, res, next, schema);
};

UserMiddleware.checkRole = async (req, res, next) => {
  const getRoles = await RolesModel.findById(req.body.role);
  if (getRoles) {
    req.roles = getRoles;
    return next();
  } else {
    return res.status(400).json({
      message: req.t("INVALID_ROLE"),
      status: false,
    });
  }
};

// check address already avalaible
UserMiddleware.checkAddressAvalaible = async (req, res, next) => {
  const getWalletDetails = await UserModel.findOne({
    walletAddress: req.body.walletAddress.toLowerCase().trim(),
  });
  if (getWalletDetails) {
    return res.status(400).json({
      message: req.t("WALLET_ADDRESS_ALREADY_REGISTERD"),
      status: false,
    });
  } else {
    return next();
  }
};

// check wallet address

UserMiddleware.loginValidator = async (req, res, next) => {
  const schema = Joi.object({
    walletAddress: Joi.string().required(),
  });
  validate.validateRequest(req, res, next, schema);
};

// aprove as Creator Validator
UserMiddleware.ValidateApproveAsCreator = async (req, res, next) => {
  const userSchema = Joi.array().items({
    id: Joi.string().required(),
    status: Joi.boolean().required(),
  });

  const schema = Joi.object({
    user: userSchema,
    transactionId: Joi.string().required(),
  });

  validate.validateRequest(req, res, next, schema);
};

//disable or enable user
UserMiddleware.disbaleEnableValidator = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    status: Joi.boolean().required(),
  });

  validate.validateRequest(req, res, next, schema);
};
module.exports = UserMiddleware;
