const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/register', async (req, res) => {
  const newUser = new User(req.body);
  try {
    const user = await newUser.save();
    return res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email: email,
      password: password,
    }).select('-password');
    if (user) {
      return res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.get('/getallusers', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post('/deleteuser', async (req, res) => {
  const userid = req.body.userid;

  try {
    await User.findOneAndDelete({ _id: userid });
    res.status(200).json({ message: 'User Deleted Successfully' });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
