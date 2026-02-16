const express = require('express');
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

//POST USER (Create new user)
router.post('/', async (req, res) => {
  try {
    // Remove confirm_Password before saving
    const { confirm_Password, ...userData } = req.body;

    let user = new userModel(userData);
    await user.save();

    // Don't send password in response
    const userResponse = user.toObject();
    delete userResponse.Password;

    res.status(201).json({
      success: true,
      message: 'User account created successfully',
      data: userResponse,
    });
  } catch (err) {
    res.status(400).json({
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
