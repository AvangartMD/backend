const mongoose = require('mongoose');

const { Schema } = mongoose;

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
      },
      tu: {
        type: String,
        required: true,
      },
    },
    mobile: {
      en: {
        type: String,
        required: true,
      },
      tu: {
        type: String,
        required: true,
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
