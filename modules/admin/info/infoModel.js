const mongoose = require("mongoose");

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

    button_text: {
        type: String,
        required: false,
        default: null,
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

module.exports = mongoose.model("info", infoSchema);
