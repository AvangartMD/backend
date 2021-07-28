const Web3Helper = require('../helper/web3Helper');
const HallHelper = require('./hallOfFrame');

const cron = require('node-cron');

cron.schedule('* * * * *', (req, res) => {
  // Web3Helper.getPastEvents(req, res);
  // Web3Helper.orderBuyedEvent(req, res);
  // Web3Helper.getTransferEventFromContract(req, res);
  // Web3Helper.getCancelledEvents(req, res);
});

cron.schedule('0 0 * * *', async (req, res) => {
  await HallHelper.getArtWorks(req, res);
  await HallHelper.getTopBuyers(req, res);
  await HallHelper.getTopCreators(req, res);
});
