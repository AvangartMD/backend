const express = require('express');
const HallOfFrameHelper = require('../../cron/hallOfFrame');
// const Auth = require('../../helper/auth');
// const auth = require('../../helper/auth');

const hallOfFrameRoute = express.Router();

// add top art works
const topArt = [HallOfFrameHelper.getArtWorks];
hallOfFrameRoute.get('/topArts', topArt);

// get top collectors
const topCollectors = [HallOfFrameHelper.getTopBuyers];
hallOfFrameRoute.get('/topCollector', topCollectors);
module.exports = hallOfFrameRoute;
