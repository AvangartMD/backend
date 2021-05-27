const mongoose = require("mongoose");
const { roles, status } = require("../../helper/enum");

const { Schema } = mongoose;

const portFolioSchema = new Schema({
  username: {
    type: String,
    default: null,
  },
  url: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      default: null,
      lowercase: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      default: null,
    },

    bio: {
      type: String,
      required: false,
    },

    portfolio: {
      instagarm: portFolioSchema,
      facebook: portFolioSchema,
      github: portFolioSchema,
      twitter: portFolioSchema,
      website: portFolioSchema,
      discord: portFolioSchema,
      youtube: portFolioSchema,
      twitch: portFolioSchema,
      tiktok: portFolioSchema,
      snapchat: portFolioSchema,
    },
    profile: {
      type: String,
      lowercase: true,
      default: null,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "roles",
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    acceptedByAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: status,
      default: "PENDING",
    },
    stage: {
      createdOn: {
        type: String,
        default: null,
      },
      approved: {
        type: String,
        default: null,
      },
      rejected: {
        type: String,
        default: null,
      },
    },
    transactionId: {
      type: String,
      default: null,
    },
  },

  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);
// coinSchema.index({ address: 1 }, { unique: true });
module.exports = mongoose.model("users", userSchema);
