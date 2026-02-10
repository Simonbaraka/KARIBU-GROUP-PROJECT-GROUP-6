const mongoose = require('mongoose');

// Create Schema (Structure of Cash Sales)
const Produce_Schema = new mongoose.Schema({
  Produce_name: {
    type: String,
    required: true,
  },

  Produce_tonnage: {
    type: Number,
    required: true,
    min: 1000,
  },

  Produce_Cost: {
    type: Number,
    required: true,
  },

  Dealer_Name: {
    type: String,
    required: true,
  },

  Date_time: {
    type: Date,
    default: Date.now,
  },

  Branch: {
    type: String,
    required: true,
  },
});

// Create Model
const Procurement_Model = mongoose.model('Procurement', Produce_Schema);

// Export Model
module.exports = Procurement_Model;
