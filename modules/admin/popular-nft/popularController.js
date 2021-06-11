const PopularNftModel = require("./popularNftModel");
const Utils = require("../../../helper/utils");
const PopularNftCtr = {};

// add new popular nft
PopularNftCtr.addNewNft = async (req, res) => {
  try {
    const { nftId, ranking } = req.body;
    const addNewNft = new PopularNftModel({
      nftId,
      ranking: ranking ? ranking : 0,
    });
    const save = await addNewNft.save();

    return res.status(200).json({
      message: req.t("POPULAR_ADDED_SUCCESSFULLY"),
      status: true,
      data: {
        details: {
          _id: save._id,
          isActive: save.isActive,
        },
      },
    });
  } catch (err) {
    Utils.echoLog("error in  creating new banner ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// update popular nft
PopularNftCtr.updatePopular = async (req, res) => {
  try {
    const fetchDetails = await PopularNftModel.findById(req.params.id);

    if (fetchDetails) {
      if (req.body.nftId) {
        fetchDetails.nftId = req.body.nftId;
      }
      if (req.body.isActive) {
        fetchDetails.isActive = req.body.isActive;
      }
      if (fetchDetails.ranking) {
        fetchDetails.ranking = req.body.ranking;
      }

      const updateDetails = await fetchDetails.save();

      return res.status(200).json({
        message: req.t("POPULAR_UPDATED_SUCCESSFULLY"),
        status: true,
        data: {
          _id: updateDetails._id,
          isActive: updateDetails.isActive,
        },
      });
    } else {
      return res.status(400).json({
        message: req.t("INVALID_ID"),
        status: false,
      });
    }
  } catch (err) {
    Utils.echoLog("error in  updating popular nft ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// delete from popular
PopularNftCtr.delete = async (req, res) => {
  try {
    const deletePopular = await PopularNftModel.deleteOne({
      _id: req.params.id,
    });

    if (deletePopular && deletePopular.deletedCount > 0) {
      return res.status(200).json({
        message: req.t("DELETED"),
        status: true,
      });
    }
  } catch (err) {
    Utils.echoLog("error in  deleteing popular nft ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// list popular nft for users

PopularNftCtr.list = async (req, res) => {
  try {
    const listPopular = await PopularNftModel.find({ isActive: true }).sort({
      ranking,
    });

    if (listPopular && listPopular.length) {
      return res.status(200).json({
        message: req.t("POPULARLIST"),
        status: true,
        data: listPopular,
      });
    } else {
    }
  } catch (err) {
    Utils.echoLog("error in  listing new banner ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// listnfts for admin
PopularNftCtr.listForAdmin = async (req, res) => {
  try {
    const listPopular = await PopularNftModel.find().sort({
      ranking,
    });

    return res.status(200).json({
      message: req.t("POPULARLIST"),
      status: true,
      data: listPopular,
    });
  } catch (err) {
    Utils.echoLog("error in  creating new banner ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// get perticular nft details
PopularNftCtr.getPerticularNftDetails = async (req, res) => {
  try {
    const getDetails = await PopularNftModel.find({ _id: req.params.id });

    return res.status(200).json({
      message: req.t("LIST"),
      status: true,
      data: getDetails,
    });
  } catch (err) {
    Utils.echoLog("error in  creating new banner ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

module.exports = PopularNftCtr;
