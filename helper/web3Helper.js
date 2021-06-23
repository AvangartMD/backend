const Web3 = require('web3');
const mongoose = require('mongoose');
const ContractAbi = require('../abi/contract.json');
const NftModel = require('../modules/nft/nftModel');
const UserModel = require('../modules/user/userModal');
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
      '0x8d987f0188564A7620D707dD05B814e19545C66B'
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
        const result = e.returnValues;
        const order = result['order'];

        // check valid mongoose id

        const checkIsValid = mongoose.isValidObjectId(result.tokenURI);

        if (checkIsValid) {
          const findNft = await NftModel.findOne({ _id: result.tokenURI });

          if (findNft && !findNft.tokenId) {
            findNft.tokenId = order.tokenId;
            findNft.status = statusObject.APPROVED;
            if (+order.saleType === 1) {
              findNft.auctionStartDate = order.timeline;
              findNft.auctionEndDate = result.timestamp;
            }

            const saveNft = await findNft.save();
            await UserModel.findByIdAndUpdate(
              { _id: saveNft.ownerId },
              { $inc: { nftCreated: 1 } }
            );
          } else if (findNft && findNft.tokenId) {
            console.log('token already minted');
          } else {
            console.log('token not found');
          }
        } else {
          console.log('not a valid token URI');
        }
      });
  } catch (err) {
    console.log('err in web3 helper', err);
  }
};

module.exports = getWeb3Event;
