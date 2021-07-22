const express = require('express');
const router = express.Router();
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_rzAMqflBQzZgmAZOEiJX1Hdy008QVZZV3k');

const formidable = require('formidable');
const AWS = require('aws-sdk');
const fs = require('fs');

const Booking = require('../models/booking');
const Storage = require('../models/storage');

// AWS S3
const s3 = new AWS.S3({
  accessKeyId: 'AKIA5BHUWGKMBUWT3Y5R',
  secretAccessKey: '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',
  region: 'eu-central-1',
});

router.post('/uploadimageid', async (req, res) => {
  const form = new formidable.IncomingForm();

  try {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: 'Image could not be uploaded',
          errors: err,
        });
      }
      const { image } = files;
      const { userid } = fields;
      // console.log(fields);

      if (image.size > 3000000) {
        return res.status(400).json({
          message: 'Image should be smaller than 3MB',
        });
      }

      // Build unique key by combining user_id and timestamp
      const imageKey = `${userid}-${Date.now()}`;
      // console.log(imageKey);

      // upload image to s3
      const params = {
        Bucket: 'ai-golf-training-app',
        Key: `ImageId/${imageKey}`,
        Body: fs.readFileSync(image.path),
        ACL: 'public-read',
        ContentType: `image/jpg`,
      };

      s3.upload(params, (err, data) => {
        if (err) {
          res.status(400).json({ message: 'Upload to s3 failed', errors: err });
        }
        // console.log('AWS UPLOAD RES DATA', data);
        res.status(200).json({ imageUrl: data.Location });
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', errors: err });
  }
});

router.post('/bookstorage', async (req, res) => {
  const {
    storage,
    userid,
    fromdate,
    todate,
    totalAmount,
    totalDays,
    imageId,
    token,
  } = req.body;

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
        imageid: imageId,
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
    // console.log(temp);
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
