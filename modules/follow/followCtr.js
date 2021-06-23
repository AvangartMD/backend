const FollowModel = require('./followModel');
const Utils = require('../../helper/utils');
const FollowCtr = {};

FollowCtr.toggle = async (req, res) => {
  try {
    if (
      req.userData._id.toLowerCase().trim() ===
      req.params.userId.toLowerCase().trim()
    ) {
      return res.status(400).json({
        message: req.t('USER_CANT_FOLLOW'),
        status: false,
      });
    } else {
      const fetchDetails = await FollowModel.findOne({
        userId: req.userData._id,
        follow: req.params.userId,
      });

      if (fetchDetails) {
        await FollowModel.deleteOne({ _id: fetchDetails._id });

        return res.status(200).json({
          message: req.t('SUCCESS'),
          status: true,
        });
      } else {
        const addNewLike = new FollowModel({
          userId: req.userData._id,
          follow: req.params.userId,
        });
        await addNewLike.save();
        return res.status(200).json({
          message: req.t('SUCCESS'),
          status: true,
        });
      }
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
