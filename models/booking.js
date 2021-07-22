const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    storage: {
      type: String,
      required: true,
    },
    storageid: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    fromdate: {
      type: String,
      required: true,
    },
    todate: {
      type: String,
      required: true,
    },
    totalamount: {
      type: Number,
      required: true,
    },
    totaldays: {
      type: Number,
      required: true,
    },
    transactionid: {
      type: String,
      required: true,
    },
    imageid: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: 'booked',
    },
  },
  { timestamps: true }
);

const bookingModel = mongoose.model('booking', bookingSchema);

module.exports = bookingModel;
