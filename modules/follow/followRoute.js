const express = require('express');
const FollowCtr = require('./followCtr');
const Auth = require('../../helper/auth');

const followRoute = express.Router();

// add New category
const toggle = [Auth.isAuthenticatedUser, followRoute.toggle];
likeRoute.get('/follow/:userId', toggle);

module.exports = likeRoute;
