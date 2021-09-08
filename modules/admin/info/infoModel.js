const mongoose = require('mongoose');

const { Schema } = mongoose;

const imageSchema = new Schema({
  en: {
    type: String,
    default: null,
    get: decryptProperty,
  },
  tu: {
    type: String,
    default: null,
    get: decryptProperty,
  },
});

const infoSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    banner: imageSchema,
    mobile: imageSchema,

    button_text: {
      en: { type: String, required: false, default: null },
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

module.exports = mongoose.model('info', infoSchema);
