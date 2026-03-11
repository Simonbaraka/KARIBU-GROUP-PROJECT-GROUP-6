const mongoose = require('mongoose');

// Create Schema (Structure of Cash Sales)
const CreditSchema = new mongoose.Schema(
  {
    Buyer_name: {
      type: String,
      required: true,
      minlength: 2,
    },

    Agent_name: {
      type: String,
      required: true,
    },

    Contact: {
      type: String,
      required: true,
    },

    Location: {
      type: String,
      required: true,
      minlength: 2,
    },
    National_ID: {
      type: String,
      required: true, // Auto set date
    },

    Produce_name: {
      type: String,
      required: true,
    },

    Tonnage: {
      type: Number,
      required: true,
      min: 500, // Minimum allowed value
    },

    Amount_Due: {
      type: Number, // Better as Number
      required: true,
      min: 10000,
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
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create Model
const CreditModel = mongoose.model('CreditSales', CreditSchema);

// Export Model
module.exports = CreditModel;
