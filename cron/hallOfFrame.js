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
          artist: [],
          artwork: topArts,
          collector: [],
          ourPicks: [],
        });

        await addNewArts.save();
      }

      if (res) {
        return res.status(200).json({
          message: req.t('CRON_ARTIST'),
          status: true,
        });
      }
    }
  } catch (err) {
    console.log('err is:', err);
    Utils.echoLog('error in art cron  ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
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
          count: { $sum: '$buyPrice' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    console.log('get history is :', getHistory);

    return res.status(200).json({
      message: req.t('CRON_ARTIST'),
      status: true,
      data: getHistory,
    });

    // if (getHistory.length) {
    //   const topArts = [];
    //   for (let i = 0; i < getHistory.length; i++) {
    //     topArts.push({
    //       nftId: getHistory[i].nftId,
    //       totalBnb: getHistory[i].buyPrice,
    //     });
    //   }

    //   //   check record exists or not
    //   const findArts = await HallOfFrameModel.findOne({}, { artWork: 1 });
    //   // if already exists
    //   if (findArts) {
    //     findArts.artwork = topArts;
    //     await findArts.save();
    //   } else {
    //     const addNewArts = new HallOfFrameModel({
    //       artist: [],
    //       artwork: topArts,
    //       collector: [],
    //       ourPicks: [],
    //     });

    //     await addNewArts.save();
    //   }

    //   if (res) {
    //     return res.status(200).json({
    //       message: req.t('CRON_ARTIST'),
    //       status: true,
    //     });
    //   }
    // }
  } catch (err) {
    console.log('err is:', err);
    Utils.echoLog('error in art cron  ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};
module.exports = hallOfFrameHelper;
