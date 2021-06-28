const NftModel = require('./nftModel');
const CollectionModel = require('./collectionModel');
const Utils = require('../../helper/utils');
const NftMiddleware = require('./nftMiddleware');
const { statusObject } = require('../../helper/enum');

const nftCtr = {};
// add a new NFT
nftCtr.addNewNft = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      collectionId,
      digitalKey,
      unlockContent,
      coCreator,
      category,
    } = req.body;

    const createNewNft = new NftModel({
      title: title,
      description: description ? description : null,
      image: image,
      ownerId: req.role === 'ADMIN' ? req.body.ownerId : req.userData._id,
      category: category,
      collectionId: collectionId ? collectionId : null,
      digitalKey: digitalKey,
      unlockContent: unlockContent ? unlockContent : false,
      coCreator: coCreator ? req.body.coCreator : null,
      price: req.body.price,
      saleState: req.body.saleState,
      auctionTime: req.body.auctionTime ? req.body.auctionTime : 0,
      edition: req.body.edition ? req.body.edition : 1,
    });

    const saveNft = await createNewNft.save();

    return res.status(200).json({
      message: req.t('ADD_NEW_NFT'),
      status: true,
      data: {
        _id: saveNft._id,
      },
    });
  } catch (err) {
    Utils.echoLog('error in nft create', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// add a new collection
nftCtr.addNewCollection = async (req, res) => {
  try {
    const { logo, name, description } = req.body;

    const addNewCollection = new CollectionModel({
      logo,
      name,
      slugText: name,
      description,
      ownerId: req.role === 'ADMIN' ? req.body.ownerId : req.userData._id,
    });

    await addNewCollection.save();

    return res.status(200).json({
      message: req.t('COLLECTION_ADDED'),
      status: true,
    });
  } catch (err) {
    Utils.echoLog('error in adding new collection', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// update the collection
nftCtr.updateCollection = async (req, res) => {
  try {
    const fetchCollection = await CollectionModel.findById(req.params.id);

    if (fetchCollection) {
      if (req.body.logo) {
        fetchCollection.logo = req.body.logo;
      }
      if (req.body.name) {
        fetchCollection.name = req.body.name;
        fetchCollection.slugText = req.body.name;
      }
      if (req.body.description) {
        fetchCollection.description = req.body.description;
      }

      await fetchCollection.save();

      return res.status(200).json({
        message: req.t('COLLECTION_UPDATED'),
        status: true,
      });
    }
  } catch (err) {
    Utils.echoLog('error in updating the collection ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// update nft
nftCtr.updateNft = async (req, res) => {
  try {
    const fetchNftDetails = await NftModel.findById(req.params.id);

    if (fetchNftDetails) {
      if (req.body.title) {
        fetchNftDetails.title = req.body.title;
      }
      if (req.body.category) {
        fetchNftDetails.category = req.body.category;
      }
      if (req.body.description) {
        fetchNftDetails.description = req.body.description;
      }
      if (req.body.image && Object.keys(req.body.image).length) {
        fetchNftDetails.image = req.body.image;
      }
      if (req.body.unlockContent) {
        fetchNftDetails.unlockContent = true;
        fetchNftDetails.digitalKey = req.body.digitalKey;
      }
      if (req.body.coCreator && Object.keys(req.body.coCreator).length) {
        fetchNftDetails.coCreator = req.body.coCreator;
      }
      if (req.body.price) {
        fetchNftDetails.price = req.body.price;
      }
      if (req.body.saleState) {
        fetchNftDetails.saleState = req.body.saleState;
      }

      if (req.body.auctionTime) {
        fetchNftDetails.auctionTime = req.body.auctionTime;
      }

      if (req.body.edition) {
        fetchNftDetails.edition = req.body.edition;
      }

      if (req.body.isActive === false) {
        fetchNftDetails.isActive = false;
      }

      if (req.body.isActive) {
        fetchNftDetails.isActive = true;
      }
      await fetchNftDetails.save();
      return res.status(200).json({
        message: req.t('NFT_UPDATED'),
        status: true,
      });
    } else {
      return res.status(400).json({
        message: req.t('INVALID_NFT'),
        status: false,
      });
    }
  } catch (err) {
    Utils.echoLog('error in updating NFT ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// list collection
nftCtr.getCollectionByUsers = async (req, res) => {
  try {
    const userId = req.params.id ? req.params.id : req.userData._id;

    const getCollectionByUser = await CollectionModel.find(
      {
        ownerId: userId,
        isActive: 1,
      },
      { isActive: 0, createdAt: 0, updatedAt: 0 }
    );

    return res.status(200).json({
      message: req.t('COLLECTION_LIST'),
      status: true,
      data: getCollectionByUser,
    });
  } catch (err) {
    Utils.echoLog('error in getting  collection list', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// get single collection details
nftCtr.getSingleCollectionDetails = async (req, res) => {
  try {
    const fetchCollectionDetails = await CollectionModel.findById(
      req.params.id
    );
    return res.status(200).json({
      message: req.t('COLLECTION_DETAILS'),
      status: true,
      data: fetchCollectionDetails,
    });
  } catch (err) {
    Utils.echoLog('error in collection details list', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// get list for admin
nftCtr.getListOfCollectionForAdmin = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const totalCount = await CollectionModel.countDocuments({ isActive: true });

    const pageCount = Math.ceil(totalCount / +process.env.LIMIT);

    const getCollectionList = await CollectionModel.find({
      isActive: true,
    })
      .populate({
        path: 'ownerId',
        select: { _id: 1, walletAddress: 1 },
      })
      .sort({ createdAt: -1 })
      .skip((+page - 1 || 0) * +process.env.LIMIT)
      .limit(+process.env.LIMIT);

    return res.status(200).json({
      message: req.t('COLLECTION_LIST'),
      status: true,
      data: getCollectionList,
      pagination: {
        pageNo: page,
        totalRecords: totalCount,
        totalPages: pageCount,
        limit: +process.env.LIMIT,
      },
    });
  } catch (err) {
    Utils.echoLog('error in getting  collection list for admin', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// get NFT By user
nftCtr.getUserNftDetails = async (req, res) => {
  try {
    const query = { ownerId: req.userData._id };

    if (req.query.collectionId) {
      query.collectionId = req.query.collectionId;
    }

    const getAllNftsByUser = await NftModel.find(query).populate({
      path: 'collectionId',
      select: { name: 1, logo: 1 },
    });

    return res.status(200).json({
      message: req.t('NFT_LIST'),
      status: true,
      data: getAllNftsByUser,
    });
  } catch (err) {
    Utils.echoLog('error in getting nft list ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// mint the nft
nftCtr.mintNft = async (req, res) => {
  try {
    const getNftDetails = await NftModel.findById(req.params.id);
    if (getNftDetails) {
      const currentDate = new Date();
      const hours =
        getNftDetails.saleState === 'AUCTION'
          ? getNftDetails.auctionTime + 24
          : 0;
      const addHours =
        getNftDetails.saleState === 'AUCTION' ? new Date().addHours(hours) : 0;

      getNftDetails.status = statusObject.APPROVED;
      getNftDetails.autionStartDate =
        getNftDetails.saleState === 'AUCTION' ? +currentDate : 0;
      getNftDetails.auctionEndDate =
        getNftDetails.saleState === 'AUCTION' ? +addHours : 0;

      await getNftDetails.save();

      return res.status(200).json({
        message: req.t('TOKEN_MINTED_ADDED'),
        status: true,
        data: getAllNftsByUser,
      });
    } else {
      return res.status(400).json({
        message: req.t('INVALID_NFT_ID'),
        status: false,
      });
    }
  } catch (err) {
    Utils.echoLog('error in mintNft nft  ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// list user NFT
nftCtr.listUsersNft = async (req, res) => {
  try {
    const query = { status: 'APPROVED' };

    if (req.query.filter === 'draft') {
      query.status = 'NOT_MINTED';
    }

    if (req.userData.role !== 'ADMIN') {
      query.ownerId = req.userData._id;
    }

    const list = await NftModel.find(query, {
      approvedByAdmin: 0,
      unlockContent: 0,
    })
      .populate({
        path: 'collectionId',
        select: { slugText: 0, ownerId: 0, createdAt: 0, updatedAt: 0 },
      })
      .populate({
        path: 'category',
        select: { createdAt: 0, updatedAt: 0 },
      })
      .populate({
        path: 'ownerId',
        select: { name: 1, username: 1 },
      });

    return res.status(200).json({
      message: req.t('USER_NFT_LIST'),
      status: true,
      data: list,
    });
  } catch (err) {
    console.log('error is:', err);
    Utils.echoLog('error in listing user  nft  ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// list nft for admin
nftCtr.listNftForAdmin = async (req, res) => {
  try {
    const query = { status: 'APPROVED' };

    if (req.query.filter === 'draft') {
      query.status = 'NOT_MINTED';
    }

    if (req.params.id) {
      query.ownerId = req.params.id;
    }

    const page = req.query.page || 1;
    const totalCount = await NftModel.countDocuments(query);

    const pageCount = Math.ceil(totalCount / +process.env.LIMIT);

    const list = await NftModel.find(query, { approvedByAdmin: 0 })
      .populate({
        path: 'collectionId',
        select: { slugText: 0, ownerId: 0, createdAt: 0, updatedAt: 0 },
      })
      .populate({
        path: 'category',
        select: { createdAt: 0, updatedAt: 0 },
      })
      .populate({
        path: 'ownerId',
        select: { name: 1, username: 1 },
      })
      .sort({ createdAt: -1 })
      .skip((+page - 1 || 0) * +process.env.LIMIT)
      .limit(+process.env.LIMIT);

    return res.status(200).json({
      message: req.t('COLLECTION_LIST'),
      status: true,
      data: list,
      pagination: {
        pageNo: page,
        totalRecords: totalCount,
        totalPages: pageCount,
        limit: +process.env.LIMIT,
      },
    });
  } catch (err) {
    Utils.echoLog('error in listing admin nft  ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// get single nft details
nftCtr.getSingleNftDetails = async (req, res) => {
  try {
    const getNftDetails = await NftModel.findById(req.params.id)
      .populate({
        path: 'collectionId',
        select: { slugText: 0, ownerId: 0, createdAt: 0, updatedAt: 0 },
      })
      .populate({
        path: 'category',
        select: { createdAt: 0, updatedAt: 0 },
      })
      .populate({
        path: 'ownerId',
        select: { name: 1, username: 1 },
      });

    return res.status(200).json({
      message: req.t('SINGLE_NFT'),
      status: true,
      data: getNftDetails,
    });
  } catch (err) {
    Utils.echoLog('error in getSingleNftDetails  ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// get nft details
nftCtr.getNftUri = async (req, res) => {
  try {
    const getDetails = await NftModel.findById(req.params.id, {
      title: 1,
      description: 1,
      image: 1,
    });

    if (getDetails) {
      return res.status(200).json({
        image: getDetails.image,
        description: getDetails.description,
        title: getDetails.title,
      });
    }
  } catch (err) {
    Utils.echoLog('error in getNftUri  ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// get nfts under collection
nftCtr.listCollectionNft = async (req, res) => {
  try {
    const getCollectionNfts = await NftModel.find(
      {
        collectionId: req.params.collectionId,
        isActive: true,
      },
      { digitalKey: 0, createdAt: 0, updatedAt: 0 }
    )
      .populate({
        path: 'ownerId',
        select: { _id: 1, walletAddress: 1, username: 1 },
      })
      .populate({
        path: 'category',
        select: { _id: 1, isActive: 1, image: 1 },
      });

    return res.status(200).json({
      message: req.t('COLLECTION_NFT'),
      status: true,
      data: getCollectionNfts,
    });
  } catch (err) {
    Utils.echoLog('error in listCollectionNft  ', err);
    return res.status(500).json({
      message: req.t('DB_ERROR'),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// market place api
nftCtr.marketPlace = async (req, res) => {
  try {
    const listNftForMarketPlace = await NftModel.find();
  } catch (err) {}
};

module.exports = nftCtr;
