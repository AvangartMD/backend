const UserModel = require("./userModal");
const RoleModel = require("../roles/rolesModal");
const Utils = require("../../helper/utils");
const jwtUtil = require("../../helper/jwtUtils");
const { statusObject } = require("../../helper/enum");

const UserCtr = {};

// update user details
UserCtr.updateUserDetails = async (req, res) => {
  try {
    const { name, surname, portfolio, profile, isCreator } = req.body;

    const fetchUserDetails = await UserModel.findById(req.userData._id);

    if (fetchUserDetails) {
      if (name) {
        fetchUserDetails.name = name;
      }
      if (surname) {
        fetchUserDetails.surname = surname;
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

UserCtr.getAllRoles = async (req, res) => {
  try {
    const getRoles = await RoleModel.find({});

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

UserCtr.login = async (req, res) => {
  try {
    const checkAddressAvalaible = await UserModel.findOne(
      {
        walletAddress: req.body.walletAddress.toLowerCase().trim(),
      },
      { acceptedByAdmin: 0, stage: 0 }
    );

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

module.exports = UserCtr;
