const Web3 = require('web3');
const mongoose = require('mongoose');
const ContractAbi = require('../abi/contract.json');
const NftModel = require('../modules/nft/nftModel');
const UserModel = require('../modules/user/userModal');
const EditionModel = require('../modules/edition/editonModel');
const HistoryModel = require('../modules/history/historyModel');
const tokenContractJson = require('../abi/token.json');
const { statusObject } = require('./enum');
const Utils = require('./utils');
const BlockJson = require('../result/blockNo.json');
const OrderBlockJson = require('../result/orderBlock.json');
const fs = require('fs');

const webSocketProvider =
  process.env.NODE_ENV === 'development'
    ? 'wss://apis.ankr.com/wss/685960a71c81496fb48ac6f3db62fe0b/bba1c9bfcdf042fa0f335035c21d3ae5/binance/full/test'
    : 'wss://bsc-ws-node.nariox.org:443';

const options = {
  timeout: 30000,
  clientConfig: {
    // Useful if requests are large
    maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
    maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

    // Useful to keep a connection alive
    keepalive: true,
    keepaliveInterval: -1, // ms
  },
  reconnect: {
    auto: true,
    delay: 1000, // ms
    maxAttempts: 10,
    onTimeout: false,
  },
};

const provider =
  process.env.NODE_ENV === 'development'
    ? 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    : 'https://bsc-dataseed.binance.org/';

const getWeb3Event = {};

getWeb3Event.getTransferEvent = async (req, res) => {
  try {
    // const web3 = new Web3(provider);
    const web3 = new Web3(
      new Web3(
        new Web3.providers.WebsocketProvider(
          'wss://bsc.getblock.io/testnet/',
          options
        )
      )
    );

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
        const nonce = getPastEvents[i].returnValues.nonce;
        const result = e.returnValues;
        const order = result['order'];
        checkMinting(result, order, nonce);
      });
  } catch (err) {
    console.log('err is:', err);
    Utils.echoLog(`Error in web3 listner for mint :${err}`);
  }
};

async function checkMinting(result, order, nonce) {
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

    // if we get token uri from token contract
    if (getTokenUri) {
      console.log('token uri is:', getTokenUri);
      // check token id is valid mongoose object id
      const checkIsValid = mongoose.isValidObjectId(getTokenUri);

      if (checkIsValid) {
        // find the nft and allocate the token id to it
        const findNft = await NftModel.findOne({ _id: getTokenUri });
        if (findNft && !findNft.tokenId) {
          findNft.tokenId = order.tokenId;
          findNft.status = statusObject.APPROVED;
          findNft.nonce = +nonce;

          if (+order.saleType === 1) {
            findNft.auctionStartDate = result.timestamp;
            findNft.auctionEndDate = order.timeline;
          }
          const saveNft = await findNft.save();

          const findUser = await UserModel.findById(saveNft.ownerId);
          if (findUser) {
            findUser.nftCreated = findUser.nftCreated + 1;
            await findUser.save();

            const addNewHistory = new HistoryModel({
              nftId: saveNft._id,
              editionNo: null,
              ownerId: findUser._id,
              text: 'Nft minted by user',
              buyPrice: saveNft.price,
              timeline: Math.floor(Date.now() / 1000),
            });

            addNewHistory.save();
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
    console.log('error in check minting', err);
    Utils.echoLog(`Error in check minting ${err}`);
  }
}

getWeb3Event.getPastEvents = async (req, res) => {
  try {
    const web3 = new Web3(provider);
    const latestBlockNo = await web3.eth.getBlockNumber();

    const contract = new web3.eth.Contract(
      ContractAbi,
      process.env.ESCROW_ADDRESS
    );
    // get last block synced
    const orderBlockFile = fs.readFileSync('./result/blockNo.json', 'utf-8');
    const orderBlock = JSON.parse(orderBlockFile);

    const getPastEvents = await contract.getPastEvents('OrderPlaced', {
      fromBlock: +orderBlock.endBlock,
      toBlock: latestBlockNo,
    });

    if (getPastEvents.length) {
      const itreateEvents = (i) => {
        if (i < getPastEvents.length) {
          // console.log('getPastEvents', getPastEvents[i].returnValues);
          // const result = getPastEvents[i].returnValues;
          const nonce = getPastEvents[i].returnValues.nonce;
          const result = getPastEvents[i].returnValues;
          const order = result['order'];

          checkMinting(result, order, nonce);
          itreateEvents(i + 1);
        } else {
          let object = {
            endBlock: latestBlockNo,
          };

          let data = JSON.stringify(object);
          fs.writeFileSync('./result/blockNo.json', data);
          Utils.echoLog('Cron fired successfully for fetching events');
        }
      };
      itreateEvents(0);
    } else {
      let object = {
        endBlock: latestBlockNo,
      };

      let data = JSON.stringify(object);
      fs.writeFileSync('./result/blockNo.json', data);
    }
  } catch (err) {
    Utils.echoLog('Err is:', err);
  }
};

getWeb3Event.orderBuyedEvent = async (req, res) => {
  try {
    const web3 = new Web3(provider);
    const latestBlockNo = await web3.eth.getBlockNumber();
    console.log('latest block no is for order:', latestBlockNo);
    const contract = new web3.eth.Contract(
      ContractAbi,
      process.env.ESCROW_ADDRESS
    );
    const orderBlockFile = fs.readFileSync('./result/orderBlock.json', 'utf-8');
    const orderBlock = JSON.parse(orderBlockFile);

    const getBuyedEvents = await contract.getPastEvents('OrderBought', {
      fromBlock: orderBlock.endBlock,
      toBlock: latestBlockNo,
    });

    console.log(
      `cron from block ${+OrderBlockJson.endBlock} -- ${latestBlockNo} `
    );

    if (getBuyedEvents.length) {
      getBuyedEvents.sort((a, b) => +a.blockNumber - +b.blockNumber);

      const itreateEvents = async (i) => {
        if (i < getBuyedEvents.length) {
          console.log(`i is: ${getBuyedEvents[i].blockNumber}   and i ${i}`);
          const result = getBuyedEvents[i].returnValues;
          const order = result['order'];
          console.log('order is:', result['buyer']);
          const transactionHash = getBuyedEvents[i].transactionHash;
          await orderEvent(result, order, transactionHash);
          itreateEvents(i + 1);
        } else {
          Utils.echoLog(`Cron fired Successfully for orderBuyedEvent`);
          console.log('CRON FIRES ');
          let object = {
            endBlock: latestBlockNo,
          };

          let data = JSON.stringify(object);
          fs.writeFileSync('./result/orderBlock.json', data);
          Utils.echoLog('Cron fired successfully for fetching events');
        }
      };
      itreateEvents(0);
    } else {
      // update blocks
      let object = {
        endBlock: latestBlockNo,
      };

      let data = JSON.stringify(object);
      fs.writeFileSync('./result/orderBlock.json', data);
    }
  } catch (err) {
    Utils.echoLog(`orderBuyedEvent ${err}`);
  }
};

async function orderEvent(result, order, transactionId) {
  return new Promise(async (resolve, reject) => {
    try {
      const getNftDetails = await NftModel.findOne({
        tokenId: order['tokenId'],
      });
      const getUserDetails = await UserModel.findOne({
        walletAddress: result['buyer'].toLowerCase().trim(),
      });

      const saleType =
        +order['saleType'] === 0
          ? 'BUY'
          : +order['saleType'] === 1
          ? 'AUCTION'
          : 'SECOND_HAND';

      if (getNftDetails && getUserDetails) {
        const checkEditionAlreadyAdded = await EditionModel.findOne({
          nftId: getNftDetails._id,
          edition: +result['amount'],
        });

        // check edition added
        if (checkEditionAlreadyAdded) {
          // check it is second hand sale
          checkEditionAlreadyAdded.transactionId = transactionId;
          checkEditionAlreadyAdded.ownerId = getUserDetails._id;
          checkEditionAlreadyAdded.price = order['pricePerNFT'];
          checkEditionAlreadyAdded.walletAddress = result['buyer'];
          checkEditionAlreadyAdded.saleAction = saleType;
          checkEditionAlreadyAdded.timeline = order['timeline'];
          checkEditionAlreadyAdded.isOpenForSale = false;

          await checkEditionAlreadyAdded.save();

          const addNewHistory = new HistoryModel({
            nftId: getNftDetails._id,
            editionNo: order['amount'],
            ownerId: getUserDetails._id,
            text: 'Nft buyed by user',
            buyPrice: order['pricePerNFT'],
            timeline: order['timeline'],
          });

          await addNewHistory.save();
          resolve(true);
        } else {
          const addNewEdition = new EditionModel({
            nftId: getNftDetails._id,
            ownerId: getUserDetails._id,
            edition: +result['amount'],
            transactionId: transactionId,
            price: order['pricePerNFT'],
            walletAddress: result['buyer'],
            saleAction: saleType,

            timeline: order['timeline'],
          });

          await addNewEdition.save();

          const addNewHistory = new HistoryModel({
            nftId: getNftDetails._id,
            editionNo: order['amount'],
            ownerId: getUserDetails._id,
            text: 'Nft buyed by user',
            buyPrice: order['pricePerNFT'],
            timeline: order['timeline'],
          });

          await addNewHistory.save();

          const getNftSold = getNftDetails.nftSold + 1;
          getNftDetails.nftSold = getNftDetails.nftSold + 1;

          if (getNftSold >= getNftDetails.edition) {
            getNftDetails.saleState = 'SOLD';
          }

          await getNftDetails.save();
          resolve(true);
        }
      } else {
        console.log('NFT DETAILS NO TFOUND ', order['tokenId']);
      }
    } catch (err) {
      console.log('error in functin', err);
      Utils.echoLog(`Error in check orderEvent ${err}`);
      reject(false);
    }
  });
}

// get nft transfer event
getWeb3Event.getTransferEvent = async (req, res) => {
  try {
    const web3 = new Web3(provider);
    const latestBlockNo = await web3.eth.getBlockNumber();
    console.log('latest block no is for order:', latestBlockNo);
    const contract = new web3.eth.Contract(
      ESCROW_ADDRESS,
      process.env.ESCROW_ADDRESS
    );
    const orderBlockFile = fs.readFileSync('./result/orderBlock.json', 'utf-8');
    const orderBlock = JSON.parse(orderBlockFile);

    const transferEvent = await contract.getPastEvents('TransferSingle', {
      fromBlock: orderBlock.endBlock,
      toBlock: latestBlockNo,
    });

    console.log(
      `cron from block ${+OrderBlockJson.endBlock} -- ${latestBlockNo} `
    );

    if (transferEvent.length) {
      transferEvent.sort((a, b) => +a.blockNumber - +b.blockNumber);
      console.log('transfer event is:', transferEvent);

      // const itreateEvents = async (i) => {
      //   if (i < getBuyedEvents.length) {
      //     console.log(`i is: ${getBuyedEvents[i].blockNumber}   and i ${i}`);
      //     const result = getBuyedEvents[i].returnValues;
      //     const order = result['order'];
      //     console.log('order is:', result['buyer']);
      //     const transactionHash = getBuyedEvents[i].transactionHash;
      //     await orderEvent(result, order, transactionHash);
      //     itreateEvents(i + 1);
      //   } else {
      //     Utils.echoLog(`Cron fired Successfully for orderBuyedEvent`);
      //     console.log('CRON FIRES ');
      //     let object = {
      //       endBlock: latestBlockNo,
      //     };

      //     let data = JSON.stringify(object);
      //     fs.writeFileSync('./result/orderBlock.json', data);
      //     Utils.echoLog('Cron fired successfully for fetching events');
      //   }
      // };
      // itreateEvents(0);
    } else {
      // update blocks
      let object = {
        endBlock: latestBlockNo,
      };

      let data = JSON.stringify(object);
      fs.writeFileSync('./result/orderBlock.json', data);
    }
  } catch (err) {
    Utils.echoLog(`orderBuyedEvent ${err}`);
  }
};
module.exports = getWeb3Event;
