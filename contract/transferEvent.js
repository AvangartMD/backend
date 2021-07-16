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

const transferEvent = {};

// transfer button
transferEvent.setTransferEvent = async (data, transactionHash) => {
  try {
    let findUser = await UserModel.findOne({
      walletAddress: data['to'].toLowerCase().trim(),
    });

    const findNft = await NftModel.findOne({ tokenId: data.id });

    // if user not in our datbase create a new use rwith creator role
    if (!findUser && findNft) {
      const getRoles = await RoleModel.findOne({ roleName: 'COLLECTOR' });
      const createUser = new UserModel({
        role: getRoles._id,
        walletAddress: data['to'].toLowerCase(),
      });

      const saveUser = await createUser.save();
      findUser = saveUser;
    }

    if (findUser && findNft) {
      const checkEditionAlreadyAdded = await EditionModel.findOne({
        nftId: findNft._id,
        edition: +data['edition'],
      });

      if (checkEditionAlreadyAdded) {
        checkEditionAlreadyAdded.ownerId = findUser._id;
        checkEditionAlreadyAdded.walletAddress = data['to'];
        checkEditionAlreadyAdded.transactionId = transactionHash;
        checkEditionAlreadyAdded.isOpenForSale = false;

        console.log('NFT TRANFERED FROM IF');

        checkEditionAlreadyAdded.save();
      } else {
        const addNewEdition = new EditionModel({
          nftId: findNft._id,
          editionNo: data['edition'],
          ownerId: findUser._id,
          buyPrice: findNft.price,
          timeline: 0,
        });

        console.log('NFT TRANFERED FROM ELSE');
        await addNewEdition.save();
      }
    } else {
      console.log('NFT AND USER NOT FOUND', data);
    }
  } catch (err) {
    console.log('err in tranfer event', err);
    Utils.echoLog(`Erroir in transfer event ${err}`);
  }
};

// burn NFt
transferEvent.burn = async (data, transactionHash) => {
  try {
    // let findUser = await UserModel.findOne({
    //   walletAddress: data['to'].toLowerCase().trim(),
    // });

    const findNft = await NftModel.findOne({ tokenId: data.id });
    if (findNft) {
      // check number of edition
      if (+findNft.edition === 1) {
        // delete the edition
        const deletEdition = await EditionModel.deleteOne({
          nftId: findNft._id,
        });
        // delete the nft
        const deleteNft = await NftModel.deleteOne({ _id: findNft._id });
        // delete if in popular
        const deletePopulat = await PopularNftModel.findOne({
          nftId: findNft._id,
        });
      }
      // if edition greate than 1
      if (+findNft.edition > 1) {
        const getEdition = EditionModel.findOne({
          edition: +data['edition'],
          nftId: findNft._id,
        });

        // make pertilcuar edition to burn
        if (getEdition && !getEdition.isBurned) {
          getEdition.isBurned = true;
          await getEdition.save();

          // change in NFT
          // decrement the count of NFt
          findNft.edition -= 1;
          if (findNft.nftSold > 1) {
            findNft.nftSold -= 1;
          }

          await findNft.save();
        } else {
          console.log('edition already burned');
        }
      }
    } else {
      Utils.echoLog(`NFT burned Not found ${data}`);
    }
  } catch (err) {
    console.log('err in burn', { err });
    Utils.echoLog(`Error in NFt Burn ${err}`);
  }
};

module.exports = transferEvent;
