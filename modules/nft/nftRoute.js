const express = require('express');
const NftCtr = require('./nftController');
const NftMiddleware = require('./nftMiddleware');
const Auth = require('../../helper/auth');
const auth = require('../../helper/auth');
const nftCtr = require('./nftController');

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

// get user collection by user id
const getCollectionListById = [
  Auth.isAuthenticatedUser,
  NftCtr.getCollectionByUsers,
];
nftRoute.get('/listCollection/:id', getCollectionListById);

// get list of collection for admin
const getCollectionListForAdmin = [
  Auth.isAuthenticatedUser,
  Auth.isAdmin,
  NftCtr.getListOfCollectionForAdmin,
];
nftRoute.get('/listCollectionForAdmin', getCollectionListForAdmin);

// get user nft
const getUserNft = [auth.isAuthenticatedUser, NftCtr.listUsersNft];
nftRoute.get('/listNftByUser', getUserNft);

// get single nft details
const getSingleNftDetails = [
  auth.checkIsAutheticated,
  NftCtr.getSingleNftDetails,
];
nftRoute.get('/single/:id', getSingleNftDetails);

// get nft list for admin
const getNftListForAdmin = [
  auth.isAuthenticatedUser,
  auth.isAdmin,
  NftCtr.listNftForAdmin,
];
nftRoute.get('/listNftForAdmin', getNftListForAdmin);

// gets specific user nft
const getNftListForAdmins = [
  auth.isAuthenticatedUser,
  auth.isAdmin,
  NftCtr.listNftForAdmin,
];
nftRoute.get('/listNftForAdmin/:id', getNftListForAdmins);

// get nft uri data

const getUri = [NftCtr.getNftUri];
nftRoute.get('/metadata/:id', getUri);

// get single collection details
const getSingleCollectionDetails = [
  auth.isAuthenticatedUser,
  NftCtr.getSingleCollectionDetails,
];
nftRoute.get('/collection/:id', getSingleCollectionDetails);

// get single collection nfts
const getCollectionNfts = [NftCtr.listCollectionNft];
nftRoute.get('/getCollectionInfo/:collectionId', getCollectionNfts);

module.exports = nftRoute;
