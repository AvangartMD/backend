const Web3 = require('web3');
const mongoose = require('mongoose');
const ContractAbi = require('../abi/contract.json');
const NftModel = require('../modules/nft/nftModel');
const UserModel = require('../modules/user/userModal');
const EditionModel = require('../modules/edition/editonModel');
const RoleModel = require('../modules/roles/rolesModal');
const Utils = require('../helper/utils');
const PopularNftModel = require('../modules/admin/popular-nft/popularNftModel');

const fs = require('fs');

const cancelledEvent = {};

// transfer button
cancelledEvent.cancelTransfer = async (editionNo, tokenId, transactionHash) => {
  try {
    const findNft = await NftModel.findOne({ tokenId: tokenId });

    if (findNft) {
      const findEdition = await EditionModel.findOne({
        nftId: tokenId._id,
        edition: +editionNo,
      });

      const saleType = {
        type: null,
        price: 0,
      };

      if (findEdition) {
        findEdition.isOpenForSale = false;
        findEdition.saleType = saleType;
        findEdition.transactionId = transactionHash;
        await findEdition.save();
      } else {
        Utils.echoLog(
          `Edition not found for ${findNft._id} with edition no ${editionNo}`
        );
      }
    } else {
      // NFT not found
      Utils.echoLog(
        `NFt not found for ${tokenId} with edition no ${editionNo}`
      );
    }
    return true;
  } catch (err) {
    Utils.echoLog(`Error in cancelTransfer event ${err} `);
    return false;
  }
};

module.exports = cancelledEvent;
