// Import required dependencies
const express = require('express');

// Import Mongoose models
const CreditModel = require('../Karibu-models/credit_sales-Model');
const Procurement_Model = require('../Karibu-models/procurement-Model');

// Create Express router instance
const router = express.Router();

// ===============================
// GET ALL CREDIT SALES
// ===============================
router.get('/', async (req, res) => {
  try {
    // Fetch all credit sales from database
    const credit = await CreditModel.find();

    // Return success response with data
    res.status(200).json({
      message: 'Credit details extracted successfully ',
      data: credit,
    });
  } catch (err) {
    // Handle server/database errors
    res.status(500).json({
      message: 'Credit sale extraction unsuccessful',
      error: err.message,
    });
  }
});

// ===============================
// GET SINGLE CREDIT SALE BY ID
// ===============================
router.get('/:id', async (req, res) => {
  try {
    // Find credit sale using ID from request parameters
    let sale = await CreditModel.findById(req.params.id);

    // If no sale found, return 404
    if (!sale) {
      return res.status(404).json({ message: 'Not found' });
    }

    // Return found sale
    res
      .status(200)
      .json({ message: 'Sales Data collection was a success ', data: sale });
  } catch (err) {
    // Invalid ID format or database error
    res.status(500).json({ message: 'Sales not found', error: err.message });
  }
});

// ===============================
// CREATE NEW CREDIT SALE (POST)
// ===============================
router.post('/', async (req, res) => {
  try {
    // Extract required fields from request body
    const { Produce_name, Tonnage } = req.body;

    // Validate required fields
    if (!Produce_name || !Tonnage) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Convert Tonnage to number (important for calculations)
    const tonnageNumber = Number(Tonnage);

    // Check if produce exists in procurement stock
    const produce = await Procurement_Model.findOne({ Produce_name });

    if (!produce) {
      return res.status(400).json({ message: 'Produce not found in stock' });
    }

    // Check if enough stock is available
    if (produce.Produce_tonnage < tonnageNumber) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Reduce stock quantity after sale
    produce.Produce_tonnage -= tonnageNumber;
    await produce.save();

    // Create new credit sale record
    const credit = new CreditModel({
      ...req.body, // spread remaining fields
      Tonnage: tonnageNumber, // ensure tonnage stored as number
    });

    console.log('Credit Sale Details', req.body);

    // Save credit sale to database
    await credit.save();

    res.status(201).json({
      message: 'Credit sale saved successfully',
      data: credit,
    });
  } catch (err) {
    console.error('CREDIT ERROR:', err);

    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
});

// ===============================
// UPDATE CREDIT SALE (PATCH)
// ===============================
router.patch('/:id', async (req, res) => {
  try {
    let id_ = req.params.id; // Extract ID
    let body = req.body; // Updated data

    // Find and update record
    const _update = await CreditModel.findByIdAndUpdate(id_, body, {
      new: true, // Return updated document
    });

    res.status(200).json({
      message: 'Credit Sale Updated ',
      data: _update,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Credit sale Update failed', error: err.message });
  }
});

// ===============================
// DELETE CREDIT SALE (WITH STOCK ROLLBACK)
// ===============================
router.delete('/:id', async (req, res) => {
  try {
    const saleId = req.params.id;

    // 1️⃣ Find the credit sale first
    const creditSale = await CreditModel.findById(saleId);

    if (!creditSale) {
      return res.status(404).json({ message: 'Credit sale not found' });
    }

    const { Produce_name, Tonnage } = creditSale;

    // 2️⃣ Find the related produce in procurement
    const produce = await Procurement_Model.findOne({ Produce_name });

    if (!produce) {
      return res.status(404).json({
        message: 'Related produce not found in procurement',
      });
    }

    // 3️⃣ Restore stock (rollback)
    produce.Produce_tonnage += Number(Tonnage);

    await produce.save();

    // 4️⃣ Delete the credit sale
    await CreditModel.findByIdAndDelete(saleId);

    res.status(200).json({
      message: 'Credit sale deleted and stock restored successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to delete credit sale',
      error: err.message,
    });
  }
});

// Export router so it can be used in main app
module.exports = router;
