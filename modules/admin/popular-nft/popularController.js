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
      });
    } else {
    }
  } catch (err) {}
};

module.exports = PopularNftCtr;
