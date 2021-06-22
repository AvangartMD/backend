const express = require('express');
const NftCtr = require('./nftController');
const NftMiddleware = require('./nftMiddleware');
const Auth = require('../../helper/auth');

const nftRoute = express.Router();
// add new Nft
const addNewNft = [
  Auth.isAuthenticatedUser,
  NftMiddleware.canAddNft,
  NftMiddleware.validateAdd,
  NftMiddleware.checkCollection,
  NftCtr.addNewNft,
];
nftRoute.post('/addNft', addNewNft);

// update nft
const updateNft = [
  Auth.isAuthenticatedUser,
  NftMiddleware.canUpdateNft,
  NftMiddleware.validateNftUpdate,
  NftCtr.updateNft,
];
nftRoute.put('/updateNft/:id', updateNft);

// add new collection
const addNewCollection = [
  Auth.isAuthenticatedUser,
  NftMiddleware.canAddNft,
  NftMiddleware.validateAddCollection,
  NftMiddleware.checkCollectionAlreadyAdded,
  NftCtr.addNewCollection,
];
nftRoute.post('/addCollection', addNewCollection);

// update Collection
const updateCollection = [
  Auth.isAuthenticatedUser,
  NftMiddleware.canUpdateCollection,
  NftMiddleware.validateCollectionUpdate,
  NftCtr.updateCollection,
];
nftRoute.put('/updateCollection/:id', updateCollection);

// get list of collections for users
const getList = [Auth.isAuthenticatedUser, NftCtr.getCollectionByUsers];
nftRoute.get('/listCollection', getList);

// get list of collection for admin
const getCollectionListForAdmin = [
  Auth.isAuthenticatedUser,
  Auth.isAdmin,
  NftCtr.getListOfCollectionForAdmin,
];
nftRoute.get('/listCollectionForAdmin', getCollectionListForAdmin);

// get nft uri data

const getUri = [NftCtr.getNftUri];
nftRoute.get('/:id', getUri);
module.exports = nftRoute;
