const Web3 = require('web3');
const ContractAbi = require('../abi/contract.json');
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
      '0x4B6c1c24A63d3D4bF69d7A84C2d6406148F21714'
    );

    contract.events
      .TransferSingle({
        filter: {
          from: '0x0000000000000000000000000000000000000000', //,
          // to: "0x8c8Ea652DE618a30348dCce6df70C8d2925E6814"
        },
        fromBlock: 6018110,
      })
      .on('data', (e) => console.log(e.returnValues));
  } catch (err) {
    console.log('err in web3 helper', err);
  }
};

module.exports = getWeb3Event;
