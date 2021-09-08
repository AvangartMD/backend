const mongoose = require('mongoose');

const { Schema } = mongoose;

const decryptProperty = function (value) {
  if (value) {
    return `${process.env.IPFSURL}/${value}`;
  } else {
    return null;
  }
};

const infoSchema = new Schema(
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

    button_text: {
      en: {
        type: String,
        required: false,
        default: null,
      },
      tu: {
        type: String,
        required: false,
        default: null,
      },
    },
    button_url: {
      type: String,
      required: false,
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

module.exports = mongoose.model('hallOfFrame', infoSchema);
