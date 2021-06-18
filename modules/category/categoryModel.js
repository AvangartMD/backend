const mongoose = require('mongoose');
const Utils = require('../../helper/utils');

const { Schema } = mongoose;
const setSlugText = (value) => {
  return value ? Utils.slugText(value) : null;
};

const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: false,
      default: null,
    },
    slugText: {
      type: String,
      lowercase: true,
      set: setSlugText,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
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

module.exports = mongoose.model('categories', categorySchema);
