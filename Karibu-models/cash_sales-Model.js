const mongoose = require('mongoose');

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
    default: Date.now,
  },

  Tonnage: {
    type: Number,
    required: true,
    min: 1000,
  },

  Amount_paid: {
    type: Number,
    required: true,
    min: 5000,
  },
});

const CashSales = mongoose.model('CashSales', cashSchema);

module.exports = CashSales;
