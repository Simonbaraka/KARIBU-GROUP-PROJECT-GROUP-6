const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  produce: {
    type: String,
    required: true,
    unique: true,
  },

  price: {
    type: Number,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Price', priceSchema);
