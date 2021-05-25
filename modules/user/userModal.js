const mongoose = require("mongoose");
const { roles, status } = require("../../helper/enum");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      default: null,
    },
    surname: {
      type: String,
      required: false,
      default: null,
    },

    portfolio: {
      instagarm: {
        type: String,
        lowercase: true,
        default: null,
      },
      facebook: {
        type: String,
        lowercase: true,
        default: null,
      },
      github: {
        type: String,
        lowercase: true,
        default: null,
      },
      twitter: {
        type: String,
        lowercase: true,
        default: null,
      },
      website: {
        type: String,
        lowercase: true,
        default: null,
      },
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
