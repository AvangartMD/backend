const Web3 = require('web3');
const mongoose = require('mongoose');
const ContractAbi = require('../abi/contract.json');
const NftModel = require('../modules/nft/nftModel');
const UserModel = require('../modules/user/userModal');
const tokenContractJson = require('../abi/token.json');
const { statusObject } = require('./enum');
const Utils = require('./utils');
const provider =
  process.env.NODE_ENV === 'development'
    ? 'wss://apis.ankr.com/wss/685960a71c81496fb48ac6f3db62fe0b/bba1c9bfcdf042fa0f335035c21d3ae5/binance/full/test'
    : 'wss://bsc-ws-node.nariox.org:443';

const getWeb3Event = {};

getWeb3Event.getTransferEvent = async (req, res) => {
  try {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(
      ContractAbi,
      process.env.ESCROW_ADDRESS
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

        checkMinting(result, order);
      });
  } catch (err) {
    console.log('err is:', err);
    Utils.echoLog(`Error in web3 listner for mint :${err}`);
  }
};

async function checkMinting(result, order) {
  try {
    const web3 = new Web3(provider);

    const tokenContract = new web3.eth.Contract(
      tokenContractJson,
      process.env.TOKEN_ADDRESS
    );
    // check valid mongoose id
    const getTokenUri = await tokenContract.methods
      .tokenURI(order.tokenId)
      .call();
    console.log('token uri is:', getTokenUri);
    // if we get token uri from token contract
    if (getTokenUri) {
      // check token id is valid mongoose object id
      const checkIsValid = mongoose.isValidObjectId(getTokenUri);

      if (checkIsValid) {
        // find the nft and allocate the token id to it
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
          // console.log('token already minted');
          Utils.echoLog(`token already minted ${findNft.tokenId}  `);
        } else {
          Utils.echoLog(`Token Uri not found in database ${getTokenUri}`);
        }
      } else {
        Utils.echoLog(`Not a cvalid token uri ${getTokenUri}`);
      }
    } else {
      Utils.echoLog(`Invalid token Uri ${getTokenUri}`);
    }
  } catch (err) {
    Utils.echoLog(`Error in check minting ${err}`);
  }
}

module.exports = getWeb3Event;
