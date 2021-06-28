const express = require('express');
const LikeCtr = require('./likeController');
const Auth = require('../../helper/auth');

const likeRoute = express.Router();

// add New category
const toggle = [Auth.isAuthenticatedUser, LikeCtr.toggle];
likeRoute.get('/toggle/:nftId', toggle);

module.exports = likeRoute;
