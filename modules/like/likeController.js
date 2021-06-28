const LikeModel = require('./likeModel');
const Utils = require('../../helper/utils');
const LikeCtr = {};

LikeCtr.toggle = async (req, res) => {
  try {
    const fetchDetails = await LikeModel.findOne({
      userId: req.userData._id,
      nftId: req.params.nftId,
    });

    if (fetchDetails) {
      await LikeModel.deleteOne({ _id: fetchDetails._id });

      return res.status(200).json({
        message: req.t('SUCCESS'),
        status: true,
      });
    } else {
      const addNewLike = new LikeModel({
        userId: req.userData._id,
        nftId: req.params.nftId,
      });
      await addNewLike.save();
      return res.status(200).json({
        message: req.t('SUCCESS'),
        status: true,
      });
    }
  } catch (err) {
    Utils.echoLog('error in toggle liking   ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

module.exports = LikeCtr;
