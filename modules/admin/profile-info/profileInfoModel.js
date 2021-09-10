const mongoose = require('mongoose');

const { Schema } = mongoose;

const decryptProperty = function (value) {
  if (value) {
    return `${process.env.IPFSURL}/${value}`;
  } else {
    return null;
  }
};

const imageSchmea = new Schema({
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
});

const profileInfoSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    banner: imageSchmea,
    mobile: imageSchmea,
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

module.exports = mongoose.model('profileInfo', profileInfoSchema);
