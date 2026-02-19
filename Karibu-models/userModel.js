const mongoose = require('mongoose');

const userschema = mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    LastName: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true, // Ensure emails are unique
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'], // Email validation
    },
    Role: {
      type: String,
      enum: ['Director', 'Manager', 'Sales Agent'],
      required: true,
    },
    Password: {
      type: String,
      required: true,
      minlength: 6, // Add minimum password length
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const userModel = mongoose.model('users', userschema);

module.exports = userModel;
