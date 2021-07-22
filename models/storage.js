const mongoose = require('mongoose');

const storageSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sizem2: {
      type: Number,
      required: true,
    },
    available: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      trim: true,
      required: true,
    },
    rentperday: {
      type: Number,
      required: true,
    },
    imageurl: {
      type: String,
      required: true,
    },
    currentbookings: [],
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const storageModel = mongoose.model('storage', storageSchema);

module.exports = storageModel;
