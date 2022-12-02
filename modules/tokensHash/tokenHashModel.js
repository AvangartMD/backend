const mongoose = require("mongoose");

const { Schema } = mongoose;

const tokenHash = new Schema({
  tokenAddress: {
    type: "string",
    required: true,
  },
  symbol: {
    type: "string",
    required: true,
  },
  txnHash: {
    type: "string",
    required: true,
  },
  status: {
    type: "string",
    required: true,
    enum: ["PENDING", "APPROVED"],
  },
});

module.exports = mongoose.model("tokenHash", tokenHash);
