const express = require('express');
const FollowCtr = require('./followCtr');
const Auth = require('../../helper/auth');

const followRoute = express.Router();

// add New category
const toggle = [Auth.isAuthenticatedUser, FollowCtr.toggle];
followRoute.get('/toggle/:userId', toggle);

module.exports = followRoute;
