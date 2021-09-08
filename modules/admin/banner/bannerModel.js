const mongoose = require('mongoose');

const { Schema } = mongoose;
const decryptProperty = function (value) {
  if (value) {
    return `${process.env.IPFSURL}/${value}`;
  } else {
    return null;
  }
};

const bannerSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    banner: {
      en: {
        type: String,
        required: true,
        get: decryptProperty,
      },
      tu: {
        type: String,
        required: true,
        get: decryptProperty,
      },
    },
    mobile: {
      en: {
        type: String,
        required: true,
        get: decryptProperty,
      },
      tu: {
        type: String,
        required: true,
        get: decryptProperty,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);

module.exports = mongoose.model('banner', bannerSchema);
