const express = require('express');
const router = express.Router();
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_rzAMqflBQzZgmAZOEiJX1Hdy008QVZZV3k');

const Booking = require('../models/booking');
const Storage = require('../models/storage');

router.post('/bookstorage', async (req, res) => {
  const { storage, userid, fromdate, todate, totalAmount, totalDays, token } =
    req.body;

  const storage_id = storage._id;
  let booking;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        currency: 'eur',
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      // console.log(JSON.stringify(payment));

      const newbooking = new Booking({
        userid,
        storage: storage.title,
        storageid: storage._id,
        totaldays: totalDays,
        fromdate: moment(fromdate).format('DD-MM-YYYY'),
        todate: moment(todate).format('DD-MM-YYYY'),
        totalamount: totalAmount,
        transactionid: payment.id,
        status: 'booked',
      });
      // console.log(JSON.stringify(newbooking));
      booking = await newbooking.save();

      const storagetemp = await Storage.findOne({ _id: storage._id });

      storagetemp.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate).format('DD-MM-YYYY'),
        todate: moment(todate).format('DD-MM-YYYY'),
        userid,
        status: booking.status,
      });
      await storagetemp.save();

      await Storage.findOneAndUpdate(
        { _id: storage_id },
        { $inc: { available: -1 } },
        { new: true }
      );
      // return res.status(200).json(booking);
    }

    res.status(200).json({ message: 'Booking success', booking });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post('/getbookingsbyuserid', async (req, res) => {
  const { userid } = req.body;

  try {
    const bookings = await Booking.find({ userid: userid }).sort({ _id: -1 });
    return res.status(200).json({ bookings });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post('/cancelbooking', async (req, res) => {
  const { bookingid, storageid } = req.body;

  try {
    const bookingitem = await Booking.findOne({ _id: bookingid });
    bookingitem.status = 'cancelled';
    await bookingitem.save();
    const storage = await Storage.findOne({ _id: storageid });
    const bookings = storage.currentbookings;
    const temp = bookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid
    );
    console.log(temp);
    storage.currentbookings = temp;
    await storage.save();

    await Storage.findOneAndUpdate(
      { _id: storageid },
      { $inc: { available: 1 } },
      { new: true }
    );

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'something went wrong', error });
  }
});

router.get('/getallbookings', async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json({ bookings });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
