const mongoose = require('mongoose');

// Create Schema (Structure of Cash Sales)
const Produce_Schema = new mongoose.Schema(
  {
    Produce_name: {
      type: String,
      required: true,
      minlength: 2,
    },

    Produce_tonnage: {
      type: Number,
      required: true,
      min: 100,
    },

    Produce_Cost: {
      type: Number,
      required: true,
      min: 10000,
    },

    Dealer_Name: {
      type: String,
      required: true,
      minlength: 2,
    },

    Dealer_Contact: {
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

    Selling_price: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create Model
const Procurement_Model = mongoose.model('Procurement', Produce_Schema);

// Export Model
module.exports = Procurement_Model;
