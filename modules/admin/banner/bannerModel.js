const mongoose = require("mongoose");

const { Schema } = mongoose;

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
      },
      tu: {
        type: String,
        required: true,
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

module.exports = mongoose.model("banner", bannerSchema);
