const mongoose = require('mongoose');
const { roles } = require('../../helper/enum');

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },

  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);

module.exports = mongoose.model('notification', notificationSchema);
