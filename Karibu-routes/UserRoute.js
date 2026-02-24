const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../Karibu-models/userModel');
let router = express.Router();

//GET all users
router.get('/', async (req, res) => {
  try {
    let users = await userModel.find().select('-Password'); // Exclude password from response
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error while retrieving data',
      error: err.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await userModel.findOne({ Email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.Role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      role: user.Role,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: err.message,
    });
  }
});

//POST USER (Create new user)
router.post('/register', async (req, res) => {
  try {
    const { Password, ...rest } = req.body;

    // Check if email exists
    const existingUser = await userModel.findOne({ Email: req.body.Email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const user = new userModel({
      ...rest,
      Password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User account created successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create user account',
      error: err.message,
    });
  }
});
//UPDATE USER
router.patch('/:id', async (req, res) => {
  try {
    // Prevent password updates through this route (should have separate route)
    const { Password, confirm_Password, ...updateData } = req.body;

    let user_update = await userModel
      .findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      })
      .select('-Password');

    if (!user_update) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User account updated successfully',
      data: user_update,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to update user account',
      error: err.message,
    });
  }
});

//DELETE USER
router.delete('/:id', async (req, res) => {
  // Changed from .patch to .delete
  try {
    let user_delete = await userModel.findByIdAndDelete(req.params.id);

    if (!user_delete) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
      data: user_delete,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete user account',
      error: err.message,
    });
  }
});

module.exports = router;
