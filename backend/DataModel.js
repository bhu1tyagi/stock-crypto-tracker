const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  allTimeHigh: { type: Number, required: true },
  volume: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
