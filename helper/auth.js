const utils = require("./utils");
const userModel = require("../modules/user/userModal");
const errorUtil = require("./error");
const jwtUtil = require("./jwtUtils");

const auth = {};
// check authentication
auth.isAuthenticatedUser = async (req, res, next) => {
  let token = req.headers && req.headers["x-auth-token"];

  if (utils.empty(token)) {
    token = req.body && req.body["x-auth-token"];
  }
  const userTokenData = jwtUtil.decodeAuthToken(token);
  // console.log("user tokn is:",userTokenData);

  if (utils.empty(userTokenData)) {
    return errorUtil.notAuthenticated(res, req);
  }

  const fetchUserDetails = await userModel.findById(userTokenData._id);
  if (fetchUserDetails) {
    // console.log("userdata is:",fetchUserDetails.email)
    req.userData = fetchUserDetails;
    return next();
  }
  return errorUtil.notAuthenticated(res, req);
};

module.exports = auth;
