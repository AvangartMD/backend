const Web3Helper = require('../helper/web3Helper');

const cron = require('node-cron');

cron.schedule('*/10 * * * *', (req, res) => {
  Web3Helper.getPastEvents(req, res);
});
