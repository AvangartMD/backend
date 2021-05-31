const mongoose = require("mongoose");

const { Schema } = mongoose;

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
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: false,
    },
    collectionId: {
      type: Schema.Types.ObjectId,
      ref: "collection",
      required: false,
    },
    isActive: { type: Boolean, default: true },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "users",
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
  },

  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);

module.exports = mongoose.model("nft", nftSchema);
