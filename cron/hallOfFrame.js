const HistoryModel = require('../modules/history/historyModel');
const HallOfFrameModel = require('../modules/hallOfFrame/hallOfFrameModel');
const Utils = require('../helper/utils');
const moment = require('moment');

const hallOfFrameHelper = {};

// top art works
hallOfFrameHelper.getArtWorks = async (req, res) => {
  try {
    //   get last 15 days NFT from history
    const getHistory = await HistoryModel.find({
      editionNo: { $ne: null },
      createdAt: {
        $gte: moment().subtract(15, 'days').toDate(),
      },
    })
      .sort({ buyPrice: -1 })
      .limit(5);

    if (getHistory.length) {
      const topArts = [];
      for (let i = 0; i < getHistory.length; i++) {
        topArts.push({
          nftId: getHistory[i].nftId,
          totalBnb: getHistory[i].buyPrice,
        });
      }

      //   check record exists or not
      const findArts = await HallOfFrameModel.findOne({}, { artWork: 1 });
      // if already exists
      if (findArts) {
        findArts.artwork = topArts;
        await findArts.save();
      } else {
        const addNewArts = new HallOfFrameModel({
          artwork: topArts,
        });

        await addNewArts.save();
      }

      if (res) {
        return res.status(200).json({
          message: req.t('CRON_ARTIST'),
          status: true,
        });
      }
      return true;
    }
  } catch (err) {
    Utils.echoLog('error in art cron  ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
  return true;
};

// top buyers
hallOfFrameHelper.getTopBuyers = async (req, res) => {
  try {
    //   get last 15 days NFT from history
    const getHistory = await HistoryModel.aggregate([
      {
        $match: {
          editionNo: { $ne: null },
          createdAt: {
            $gte: moment().subtract(15, 'days').toDate(),
          },
        },
      },
      {
        $group: {
          _id: '$ownerId',
          // history: { $push: '$$ROOT' },
          // total: { $sum: '$$ROOT.buyPrice ' },
          totalBnb: { $sum: '$buyPrice' },
        },
      },
      { $sort: { totalBnb: -1 } },
      { $limit: 5 },
    ]);

    let collectors = [];

    if (getHistory.length) {
      for (let j = 0; j < getHistory.length; j++) {
        collectors.push({
          userId: getHistory[j]._id,
          totalBnb: getHistory[j].totalBnb,
        });
      }
    }

    //   check record exists or not
    const findCollector = await HallOfFrameModel.findOne({}, { collector: 1 });
    // if already exists
    if (findCollector) {
      findCollector.collector = collectors;
      await findCollector.save();
    } else {
      const addNewCollector = new HallOfFrameModel({
        collector: collectors,
      });

      await addNewCollector.save();
    }

    if (res) {
      return res.status(200).json({
        message: req.t('CRON_COLLECTOR'),
        status: true,
        data: getHistory,
      });
    }
    return true;
  } catch (err) {
    Utils.echoLog(`Error in collector cron ${err}`);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};
module.exports = hallOfFrameHelper;
