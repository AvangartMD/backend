const Web3Helper = require('../helper/web3Helper');

const cron = require('node-cron');

cron.schedule('* * * * *', (req, res) => {
  console.log('cron for past events and order called');
  Web3Helper.getPastEvents(req, res);
  Web3Helper.orderBuyedEvent(req, res);
  Web3Helper.getTransferEventFromContract(req, res);
});
