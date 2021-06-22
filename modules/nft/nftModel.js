const mongoose = require('mongoose');

const { Schema } = mongoose;
const { roles, nftStatus } = require('../../helper/enum');

const nftSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: null,
    },
    tokenId: {
      type: Number,
      unique: true,
      default: undefined,
    },
    image: {
      original: {
        type: String,
        default: null,
      },
      compressed: {
        type: String,
        default: null,
      },
    },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: false,
      },
    ],
    collectionId: {
      type: Schema.Types.ObjectId,
      ref: 'collection',
      required: false,
    },
    isActive: { type: Boolean, default: true },

    approvedByAdmin: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      required: true,
      enum: nftStatus,
      default: 'NOT_MINTED',
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    digitalKey: {
      type: String,
      default: null,
    },
    unlockContent: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    saleState: {
      type: String,
      enum: ['BUY', 'AUCTION'],
      required: true,
    },
    auctionTime: {
      type: Number,
      default: 0,
    },
    edition: {
      type: Number,
      default: 1,
    },
    auctionStartDate: {
      type: String,
      default: null,
    },
    auctionEndDate: {
      type: Number,
      default: null,
    },
    coCreator: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: null,
      },
      percentage: {
        type: Number,
        default: null,
      },
    },
  },

  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);

module.exports = mongoose.model('nft', nftSchema);
