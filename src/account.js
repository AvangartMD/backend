const Web3 = require('web3');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

const account = web3.eth.accounts.create();
const myAccount = web3.eth.accounts.privateKeyToAccount("8fd6a27adfa506207495b6d9ac22bc92374fcd3b90c0e69b80c90ae6bf0f4a8b")
//console.log(myAccount.address);

module.exports = myAccount.address;