const Web3 = require('web3');
const mongoose = require('mongoose');
const ContractAbi = require('../abi/contract.json');
const NftModel = require('../modules/nft/nftModel');
const UserModel = require('../modules/user/userModal');
const tokenContractJson = require('../abi/token.json');
const { statusObject } = require('./enum');
const provider =
  process.env.NODE_ENV === 'development'
    ? 'wss://data-seed-prebsc-1-s1.binance.org:8545'
    : 'wss://bsc-ws-node.nariox.org:443';

const getWeb3Event = {};

getWeb3Event.getTransferEvent = async (req, res) => {
  try {
    const web3 = new Web3(provider);

    const contract = new web3.eth.Contract(
      ContractAbi,
      process.env.ESCROW_ADDRESS
    );

    const tokenContract = new web3.eth.Contract(
      tokenContractJson,
      process.env.TOKEN_ADDRESS
    );

    contract.events
      .OrderPlaced({
        // filter: {
        //   from: '0x0000000000000000000000000000000000000000', //,
        //   // to: "0x8c8Ea652DE618a30348dCce6df70C8d2925E6814"
        // },
        fromBlock: 6018110,
      })
      .on('data', async (e) => {
        // console.log('eis:', e);
        const result = e.returnValues;
        const order = result['order'];

        // check valid mongoose id

        console.log(order.tokenId);

        const getTokenUri = await tokenContract.methods
          .tokenURI(order.tokenId)
          .call();

        if (getTokenUri) {
          const checkIsValid = mongoose.isValidObjectId(getTokenUri);
          if (checkIsValid) {
            const findNft = await NftModel.findOne({ _id: getTokenUri });
            if (findNft && !findNft.tokenId) {
              findNft.tokenId = order.tokenId;
              findNft.status = statusObject.APPROVED;
              if (+order.saleType === 1) {
                findNft.auctionStartDate = order.timeline;
                findNft.auctionEndDate = result.timestamp;
              }
              const saveNft = await findNft.save();
              const findUser = await UserModel.findById(saveNft.ownerId);
              if (findUser) {
                findUser.nftCreated = findUser.nftCreated + 1;
                await findUser.save();
              }
            } else if (findNft && findNft.tokenId) {
              console.log('token already minted');
            } else {
              console.log('token not found');
            }
          } else {
            console.log('not a valid token URI');
          }
        } else {
          console.log('Token Id is inavlid');
        }
      });
  } catch (err) {
    console.log('err in web3 helper', err);
  }
};

module.exports = getWeb3Event;
