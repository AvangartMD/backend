const Utils = require("../../../helper/utils");
const Joi = require("joi");
const validate = require("../../../helper/validateRequest");
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();
const { cachedData } = require("../../../helper/enum");

const ProfileInfoMiddleware = {};

//validate add middleware
ProfileInfoMiddleware.validateAdd = async (req, res, next) => {
    const imageSchema = Joi.object().keys({
        en: Joi.string().uri().required(),
        tu: Joi.string().uri().required(),
    });
    const schema = Joi.object({
        url: Joi.string().uri().required(),
        banner: imageSchema,
    });
    validate.validateRequest(req, res, next, schema);
};

// udpate validator
ProfileInfoMiddleware.validateUpdate = async (req, res, next) => {
    const imageSchema = Joi.object().keys({
        en: Joi.string().uri(),
        tu: Joi.string().uri(),
    });
    const schema = Joi.object({
        url: Joi.string(),
        banner: imageSchema,
        status: Joi.boolean(),
    });
    validate.validateRequest(req, res, next, schema);
};

// list banner for user
ProfileInfoMiddleware.listProfileInfo = async (req, res, next) => {
    try {
        const checkCacheAvalaible = await client.get(cachedData.LIST_PROFILE_INFO);

        if (checkCacheAvalaible && checkCacheAvalaible.length) {
            return res.status(200).json({
                message: req.t("PROFILE_INFO_LIST"),
                status: true,
                data: JSON.parse(checkCacheAvalaible),
            });
        } else {
            return next();
        }
    } catch (err) {
        Utils.echoLog(`Error in profile info middleware ${err}`);
    }
};

module.exports = ProfileInfoMiddleware;