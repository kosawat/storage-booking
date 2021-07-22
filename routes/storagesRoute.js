const express = require('express');
const router = express.Router();

const Storage = require('../models/storage');

router.get('/getallstorages', async (req, res) => {
  try {
    const storages = await Storage.find({});
    return res.status(200).json({ storages });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post('/getstoragebyid', async (req, res) => {
  // console.log(req.body);
  try {
    const storage = await Storage.findOne({ _id: req.body.storageid });
    res.status(200).json(storage);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post('/addstorage', async (req, res) => {
  const {
    title,
    description,
    sizem2,
    available,
    address,
    city,
    phonenumber,
    rentperday,
    imageurl,
    type,
  } = req.body;

  const newstorage = new Storage({
    title,
    description,
    sizem2,
    available,
    address,
    city,
    phonenumber,
    rentperday,
    imageurl,
    type,
    currentbookings: [],
  });
  try {
    const result = await newstorage.save();
    res.status(200).json({ message: 'New storage added successfully', result });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
