const mongoose = require('mongoose');
const Utils = require('../../helper/utils');

const { Schema } = mongoose;

const setSlugText = (value) => {
  return value ? Utils.slugText(value) : null;
};

const collectionSchema = new Schema(
  {
    logo: {
      type: String,
      default: null,
      required: false,
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    slugText: {
      type: String,
      lowercase: true,
      set: setSlugText,
    },
    description: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
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

module.exports = mongoose.model('collection', collectionSchema);
