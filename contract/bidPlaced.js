const EditionModel = require('../modules/edition/editonModel');
const NftModel = require('../modules/nft/nftModel');
const BidModel = require('../modules/bid/bidModel');
const UserModal = require('../modules/user/userModal');
const NotificationModel = require('../modules/notification/notificationModel');
const Utils = require('../helper/utils');

const bidPlaced = {};

bidPlaced.checkBid = async (result, order) => {
  try {
    const fetchNftDetails = await NftModel.findOne({
      tokenId: +order['tokenId'],
    });

    const fetchUser = await UserModal.findOne({
      walletAddress: order['seller'].toLowerCase(),
    });

    if (fetchNftDetails && fetchUser) {
      // check any bid is placed or not
      const checkBidAlreadyPlaced = await BidModel.findOne({
        nftId: fetchNftDetails._id,
        editionNo: result['editionNumber'],
      });

      //   if bid is already placed send notification to previous user that bid is cancelled
      if (checkBidAlreadyPlaced) {
        //   check notification already added otr not
        const checkNotificationAdded = await NotificationModel.findOne({
          userId: checkBidAlreadyPlaced.userId,
          bidId: checkBidAlreadyPlaced._id,
        });

        // if not add the notification
        if (!checkNotificationAdded) {
          const addNewNotification = new NotificationModel({
            text: `Your Bid for ${fetchNftDetails.title} for edition No ${result['editonNo']} is cancelled`,
            userId: checkBidAlreadyPlaced.userId,
            bidId: checkBidAlreadyPlaced._id,
            route: `/nftDetails/${fetchNftDetails._id}`,
          });

          if (+order['saleType'] === 3) {
            const notifySeller = new NotificationModel({
              text: `A new Offer is received for ${fetchNftDetails.title}`,
              userId: checkBidAlreadyPlaced.userId,
              route: `/nftDetails/${fetchNftDetails._id}`,
            });

            await notifySeller.save();
          }

          await addNewNotification.save();

          checkBidAlreadyPlaced.userId = fetchUser._id;

          await checkBidAlreadyPlaced.save();
        } else {
          checkBidAlreadyPlaced.userId = fetchUser._id;
          await checkBidAlreadyPlaced.save();
        }
      } else {
        //   add the new bid
        const addNewBid = new BidModel({
          userId: fetchUser._id,
          nftId: fetchNftDetails._id,
          editionNo: +result['editionNumber'],
        });
        await addNewBid.save();

        if (+order['saleType'] === 3) {
          const notifySeller = new NotificationModel({
            text: `A new Offer is received for ${fetchNftDetails.title}`,
            userId: checkBidAlreadyPlaced.userId,
            route: `/nftDetails/${fetchNftDetails._id}`,
          });

          await notifySeller.save();
        }
      }
    }
  } catch (err) {
    Utils.echoLog(`Error in bid placed event ${err}`);
  }
};

module.exports = bidPlaced;
