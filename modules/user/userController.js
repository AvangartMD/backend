const UserModel = require("./userModal");
const RoleModel = require("../roles/rolesModal");
const Utils = require("../../helper/utils");
const jwtUtil = require("../../helper/jwtUtils");
const NotificationModel = require("../notification/notificationModel");
const crypto = require("crypto");
const { statusObject } = require("../../helper/enum");
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

const UserCtr = {};

// update user details
UserCtr.updateUserDetails = async (req, res) => {
  try {
    const { name, email, portfolio, profile, isCreator, bio } = req.body;

    const fetchUserDetails = await UserModel.findById(req.userData._id);

    if (fetchUserDetails) {
      if (name) {
        fetchUserDetails.name = name;
      }
      if (bio) {
        fetchUserDetails.bio = bio;
      }
      if (email) {
        fetchUserDetails.email = email;
      }
      if (portfolio && Object.keys(portfolio).length) {
        fetchUserDetails.portfolio = portfolio;
      }
      if (profile) {
        fetchUserDetails.profile = profile;
      }
      if (isCreator) {
        const fetchRole = await RoleModel.findOne({ roleName: "CREATOR" });
        fetchUserDetails.role = fetchRole._id;
      }

      const saveUser = await fetchUserDetails.save();
      return res.status(200).json({
        message: req.t("USER_UPDATED_SUCCESSFULLY"),
        status: true,
        data: {
          details: {
            name: saveUser.name,
            surname: saveUser.surname,
            status: saveUser.status,
            profile: saveUser.profile,
            portfolio: saveUser.portfolio,
            email: saveUser.email,
            bio: saveUser.bio,
          },
        },
      });
    }
  } catch (err) {
    Utils.echoLog("error in creating user ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// get all active roles
UserCtr.getAllRoles = async (req, res) => {
  try {
    const getRoles = await RoleModel.find({ isActive: true });

    return res.status(200).json({
      message: req.t("ROLES"),
      status: true,
      data: getRoles,
    });
  } catch (err) {
    Utils.echoLog("error in gettting  user roles ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};
// login initally
UserCtr.login = async (req, res) => {
  try {
    const checkAddressAvalaible = await UserModel.findOne(
      {
        walletAddress: req.body.walletAddress.toLowerCase().trim(),
      },
      { acceptedByAdmin: 0, stage: 0 }
    ).populate({
      path: "role",
      select: { _id: 1, roleName: 1 },
    });

    if (checkAddressAvalaible) {
      // create the token and sent i tin response
      const token = jwtUtil.getAuthToken({
        _id: checkAddressAvalaible._id,
        role: checkAddressAvalaible.role,
        walletAddress: checkAddressAvalaible.walletAddress,
      });

      return res.status(200).json({
        message: req.t("SUCCESS"),
        status: true,
        data: {
          token,
          details: checkAddressAvalaible,
        },
      });
    } else {
      const getRoles = await RoleModel.findOne({ roleName: "COLLECTOR" });
      const createUser = new UserModel({
        role: getRoles._id,
        walletAddress: req.body.walletAddress.toLowerCase(),
      });

      const saveUser = await createUser.save();

      const token = jwtUtil.getAuthToken({
        _id: saveUser._id,
        role: saveUser.role,
        walletAddress: saveUser.walletAddress,
      });

      return res.status(200).json({
        message: req.t("SUCCESS"),
        status: true,
        data: {
          token,
          details: {
            name: saveUser.name,
            surname: saveUser.surname,
            status: saveUser.status,
            profile: saveUser.profile,
            portfolio: saveUser.portfolio,
            role: {
              roleName: "COLLECTOR",
              _id: saveUser.role,
            },
          },
        },
      });
    }
  } catch (err) {
    Utils.echoLog("error in singnup  ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// list all users for admin
UserCtr.list = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const query = {};

    if (req.query.roleId) {
      query.role = req.query.roleId;
    }
    if (req.query.status) {
      query.status = req.query.status.toUpperCase();
    }

    const totalCount = await UserModel.countDocuments(query);
    const pageCount = Math.ceil(totalCount / +process.env.LIMIT);

    const list = await UserModel.find(query)
      .populate({
        path: "role",
        select: { _id: 1, roleName: 1 },
      })
      .skip((+page - 1 || 0) * +process.env.LIMIT)
      .limit(+process.env.LIMIT);

    return res.status(200).json({
      message: req.t("SUCCESS"),
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
    Utils.echoLog("error in listing user   ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// get user details
UserCtr.getUserDetails = async (req, res) => {
  try {
    const query = {};
    if (req.query.userId && req.role == "ADMIN") {
      query._id = req.query.userId;
    } else {
      if (req.userData && req.userData._id && req.role !== "ADMIN") {
        query._id = req.userData._id;
      }
    }

    if (Object.keys(query).length) {
      const fetchUserData = await UserModel.findOne(query);

      return res.status(200).json({
        message: req.t("SUCCESS"),
        status: true,
        data: fetchUserData,
      });
    } else {
      return res.status(400).json({
        message: req.t("INVALID_DETAILS"),
        status: false,
      });
    }
  } catch (err) {
    Utils.echoLog("error in listing user   ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// approve user as a creator
UserCtr.approveAsCreator = async (req, res) => {
  try {
    const { user } = req.body;
    if (user.length) {
      for (let i = 0; i < user.length; i++) {
        const getUserDetails = await UserModel.findById(user[i].id);
        if (getUserDetails) {
          const getRoleDetails = await RoleModel.findOne({
            roleName: "CREATOR",
          });

          const stage = {
            approved: user[i].status ? +new Date() : null,
            rejected: !user[i].status ? +new Date() : null,
          };

          if (user[i].status) {
            getUserDetails.acceptedByAdmin = true;
            getUserDetails.role = getRoleDetails._id;
            getUserDetails.status = statusObject.APPROVED;
            getUserDetails.stage = stage;
            getUserDetails.transactionId = req.body.transactionId;
          } else {
            getUserDetails.acceptedByAdmin = false;
            getUserDetails.status = statusObject.REJECTED;
            getUserDetails.stage = stage;
          }
          await getUserDetails.save();

          const addNewNotication = new NotificationModel({
            text: user[i].status
              ? req.t("REQUEST_ACCEPTED")
              : req.t("REQUSET_REJECTED"),
            userId: getUserDetails,
          });

          addNewNotication.save();
        } else {
          next();
        }
      }

      return res.status(200).json({
        message: req.t("USER_STATUS_UPDATED"),
        status: true,
      });
    } else {
      return res.status(200).json({
        message: req.t("USER_STATUS_UPDATED"),
        status: true,
      });
    }
  } catch (err) {
    Utils.echoLog("error in approving  user   ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// disable user for using platform
UserCtr.disableUser = async (req, res) => {
  try {
    const getUserDetails = await UserModel.findById(req.body.id);
    if (getUserDetails) {
      UserModel.isActive = req.body.status;

      await getUserDetails.save();
      return res.status(200).json({
        message: req.t("USER_DISABLED_SUCCESSFULLY"),
        status: true,
      });
    } else {
      return res.status(400).json({
        message: req.t("INVALID_USER_DETAILS"),
        status: false,
      });
    }
  } catch (err) {
    Utils.echoLog("error in disabling user ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// add user as creator by admin
UserCtr.addUserByAdmin = async (req, res) => {
  try {
    const { walletAddress, name, profile, bio, email } = req.body;
    const fetchRole = await RoleModel.findOne({ roleName: "CREATOR" });

    const addNewUser = new UserModel({
      name: name,
      walletAddress: walletAddress,
      profile: profile ? profile : null,
      bio: bio ? bio : null,
      email: email ? email : null,
      role: fetchRole._id,
    });

    const saveUser = await addNewUser.save();

    return res.status(200).json({
      message: req.t("USER_REGISTERED_SUCCESSFULLY"),
      status: true,
      data: {
        _id: saveUser._id,
        name: saveUser.name,
        walletAddress: saveUser.walletAddress,
      },
    });
  } catch (err) {
    Utils.echoLog("error in adding new user  by admin ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// genrate a nonce
UserCtr.genrateNonce = async (req, res) => {
  try {
    let nonce = crypto.randomBytes(16).toString("hex");
    const data = {
      walletAddress: req.params.address,
      nonce: nonce,
    };

    await client.set(nonce, JSON.stringify(data), "EX", 60 * 10);

    return res.status(200).json({
      message: req.t("NONCE_GENRATED"),
      status: true,
      data: {
        nonce: nonce,
      },
    });
  } catch (err) {
    Utils.echoLog("error in genrating nonce  ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};
module.exports = UserCtr;
