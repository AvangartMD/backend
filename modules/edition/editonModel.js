const mongoose = require('mongoose');

const { Schema } = mongoose;

const editionSchema = new Schema(
  {
    nftId: {
      type: Schema.Types.ObjectId,
      ref: 'nft',
      required: true,
    },
    transactionId: {
      type: String,
      required: false,
      default: null,
    },
    price: {
      type: Number,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    edition: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    isOpenForSale: {
      type: Boolean,
      default: false,
    },
    saleType: {
      type: String,
      enum: ['OFFER'],
      default: null,
    },
    saleAction: {
      type: String,
      enum: ['AUCTION', 'BUY', 'SECOND_HAND'],
      default: null,
    },
    timeline: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);

module.exports = mongoose.model('edition', editionSchema);
