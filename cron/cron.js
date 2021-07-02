const Web3Helper = require('../helper/web3Helper');

const cron = require('node-cron');

cron.schedule('* * * * *', (req, res) => {
  Web3Helper.getPastEvents(req, res);
});
