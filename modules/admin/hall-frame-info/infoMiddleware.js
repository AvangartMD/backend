const InfoModel = require("./infoModel");
const Utils = require("../../../helper/utils");
const Joi = require("joi");
const validate = require("../../../helper/validateRequest");
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();
const { cachedData } = require("../../../helper/enum");

const InfoMiddleware = {};


//validate add middleware
InfoMiddleware.validateAdd = async (req, res, next) => {
  const imageSchema = Joi.object().keys({
    en: Joi.string().uri().required(),
    tu: Joi.string().uri().required(),
  });
  const schema = Joi.object({
    url: Joi.string().uri().required(),
    banner: imageSchema,
    button_text: Joi.string().allow(null, ''),
    button_url: Joi.string().uri().allow(null, ''),
  });
  validate.validateRequest(req, res, next, schema);
};

// udpate validator
InfoMiddleware.validateUpdate = async (req, res, next) => {
  const imageSchema = Joi.object().keys({
    en: Joi.string().uri(),
    tu: Joi.string().uri(),
  });
  const schema = Joi.object({
    url: Joi.string(),
    banner: imageSchema,
    status: Joi.boolean(),
    button_text: Joi.string().allow(null, ''),
    button_url: Joi.string().uri().allow(null, ''),
  });
  validate.validateRequest(req, res, next, schema);
};

// list info for user
InfoMiddleware.listInfo = async (req, res, next) => {
  try {
    const checkCacheAvalaible = await client.get(cachedData.LIST_INFO);

    if (checkCacheAvalaible && checkCacheAvalaible.length) {
      return res.status(200).json({
        message: req.t("HALL_FRAME_INFO_LIST"),
        status: true,
        data: JSON.parse(checkCacheAvalaible),
      });
    } else {
      return next();
    }
  } catch (err) {
    Utils.echoLog(`Error in hall of frame middleware ${err}`);
  }
};

module.exports = InfoMiddleware;