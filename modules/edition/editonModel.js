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
  },

  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);

module.exports = mongoose.model('roles', rolesSchema);
