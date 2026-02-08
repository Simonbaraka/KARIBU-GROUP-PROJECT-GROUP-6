const mongoose = require('mongoose');

// Create Schema (Structure of Cash Sales)
const cashSchema = new mongoose.Schema({
  Produce_name: {
    type: String,
    required: true,
  },

  Buyer_name: {
    type: String,
    required: true,
  },

  Agent_name: {
    type: String,
    required: true,
  },

  Date_time: {
    type: Date,
    default: Date.now, // Auto set date
  },

  Tonnage: {
    type: Number,
    required: true,
    min: 1000, // Minimum allowed value
  },

  Amount_paid: {
    type: Number, // Better as Number
    required: true,
  },
});

// Create Model
const CashModel = mongoose.model('CashSales', cashSchema);

// Export Model
module.exports = { CashModel };
