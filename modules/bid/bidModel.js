const mongoose = require('mongoose');

const { Schema } = mongoose;

const bidSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    nftId: {
      type: Schema.Types.ObjectId,
      ref: 'nft',
      required: true,
    },
    editionNo: {
      type: Number,
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

module.exports = mongoose.model('bid', bidSchema);
