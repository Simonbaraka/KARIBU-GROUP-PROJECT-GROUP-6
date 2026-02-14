const mongoose = require('mongoose');

// Create Schema (Structure of Cash Sales)
const CreditSchema = new mongoose.Schema({
  Buyer_name: {
    type: String,
    required: true,
  },

  Agent_name: {
    type: String,
    required: true,
  },

  Contact: {
    type: Number,
    required: true,
  },

  Location: {
    type: String,
    required: true,
  },
  National_ID: {
    type: Number,
    required: true, // Auto set date
  },

  Produce_name: {
    type: String,
    required: true,
  },

  Tonnage: {
    type: Number,
    required: true,
    min: 1000, // Minimum allowed value
  },

  Amount_Due: {
    type: Number, // Better as Number
    required: true,
  },

  Date_time: {
    type: Date,
    default: Date.now, // Auto set date
    required: true,
  },

  Branch: {
    type: String,
    required: true,
  },
});

// Create Model
const CreditModel = mongoose.model('CreditSales', CreditSchema);

// Export Model
module.exports = CreditModel;
