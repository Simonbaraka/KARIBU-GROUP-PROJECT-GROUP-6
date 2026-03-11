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

// ✅ Only change is this line
module.exports = mongoose.models.Price || mongoose.model('Price', priceSchema);
