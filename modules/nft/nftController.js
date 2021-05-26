const NftModel = require("./nftModel");
const CollectionModel = require("./collectionModel");
const Utils = require("../../helper/utils");
const NftMiddleware = require("./nftMiddleware");

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
    } = req.body;

    const createNewNft = new NftModel({
      title: title,
      description: description ? description : null,
      image: image,
      ownerId: req.role === "ADMIN" ? req.body.ownerId : req.userData._id,
      collectionId: collectionId ? collectionId : null,
      digitalKey: digitalKey,
      unlockContent: unlockContent ? unlockContent : false,
    });

    await createNewNft.save();

    return res.status(200).json({
      message: req.t("ADD_NEW_NFT"),
      status: true,
    });
  } catch (err) {
    Utils.echoLog("error in nft create", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
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
      ownerId: req.role === "ADMIN" ? req.body.ownerId : req.userData._id,
    });

    await addNewCollection.save();

    return res.status(200).json({
      message: req.t("COLLECTION_ADDED"),
      status: true,
    });
  } catch (err) {
    Utils.echoLog("error in adding new collection", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
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
        message: req.t("COLLECTION_UPDATED"),
        status: true,
      });
    }
  } catch (err) {
    Utils.echoLog("error in updating the collection ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
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

      await fetchNftDetails.save();
      return res.status(200).json({
        message: req.t("NFT_UPDATED"),
        status: true,
      });
    } else {
      return res.status(400).json({
        message: req.t("INVALID_NFT"),
        status: false,
      });
    }
  } catch (err) {
    Utils.echoLog("error in updating NFT ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// list collection
nftCtr.getCollectionByUsers = async (req, res) => {
  try {
    const getCollectionByUser = await NftModel.find(
      {
        ownerId: req.userData._id,
        isActive: 1,
      },
      { isActive: 0 }
    );

    return res.status(200).json({
      message: req.t("COLLECTION_LIST"),
      status: true,
      data: getCollectionByUser,
    });
  } catch (err) {
    Utils.echoLog("error in getting  collection list", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
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
        path: "ownerId",
        select: { _id: 1, walletAddress: 1 },
      })
      .sort({ createdAt: -1 })
      .skip((+page - 1 || 0) * +process.env.LIMIT)
      .limit(+process.env.LIMIT);

    return res.status(200).json({
      message: req.t("COLLECTION_LIST"),
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
    Utils.echoLog("error in getting  collection list for admin", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
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
      path: "collectionId",
      select: { name: 1, logo: 1 },
    });

    return res.status(200).json({
      message: req.t("NFT_LIST"),
      status: true,
      data: getAllNftsByUser,
    });
  } catch (err) {
    Utils.echoLog("error in getting nft list ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

module.exports = nftCtr;
