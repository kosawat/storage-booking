const mongoose = require('mongoose');

const mongoDBURL =
  'mongodb+srv://ivy-db:d2g0injwl2fxYKRZ@ivy-challenge.wipwk.mongodb.net/storages?retryWrites=true&w=majority'; //'mongodb+srv://sathya:sathyapr@cluster0.wrqpt.mongodb.net/sheyrooms'

mongoose.connect(mongoDBURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const dbconnect = mongoose.connection;

dbconnect.on('error', () => {
  console.log(`Mongo DB Connection Failed`);
});

dbconnect.on('connected', () => {
  console.log(`Mongo DB Connection Successful`);
});

module.exports = mongoose;
