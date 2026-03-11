const mongoose = require('mongoose');

const cashSchema = new mongoose.Schema(
  {
    Produce_name: {
      type: String,
      required: true,
    },

    Buyer_name: {
      type: String,
      required: true,
      minlength: 2,
    },

    Agent_name: {
      type: String,
      required: true,
      minlength: 2,
    },

    Date_time: {
      type: Date,
      default: Date.now,
    },

    Price_per_kg: {
      type: Number,
      required: true,
      min: 0,
    },

    Tonnage: {
      type: Number,
      required: true,
      min: 0,
    },

    Amount_paid: {
      type: Number,
      required: true,
      min: 10000,
    },

    Branch: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const CashSales = mongoose.model('CashSales', cashSchema);

module.exports = CashSales;
