// Import required dependencies
const express = require('express');

// Import Mongoose models
const CreditModel = require('../Karibu-models/credit_sales-Model');
const { authenticateToken } = require('../Karibu-middleware/userAuth');
const { authorizeRole } = require('../Karibu-middleware/userAuth');
const { validateSale } = require('../Karibu-middleware/salesMiddleware');
const {
  checkStock,
  deductStock,
} = require('../Karibu-middleware/stockMiddleware');
const {
  restoreStockOnDelete,
} = require('../Karibu-middleware/restoreStockMiddleware');
const { authorizeBranch } = require('../Karibu-middleware/BranchMiddleware');

// Create Express router instance
const router = express.Router();

// ===============================
// GET ALL CREDIT SALES
// ===============================
router.get('/', async (req, res) => {
  try {
    const credit = await CreditModel.find();
    res
      .status(200)
      .json({ message: 'Credit details extracted successfully', data: credit });
  } catch (err) {
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
router.post(
  '/',
  authenticateToken,
  authorizeRole('Sales Agent', 'Manager'),
  validateSale,
  checkStock,
  deductStock,
  authorizeBranch,
  async (req, res) => {
    try {
      // Create new credit sale record
      const credit = new CreditModel({ ...req.body }); // Tonnage already validated

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
  }
);

// ===============================
// UPDATE CREDIT SALE (PATCH)
// ===============================
router.patch(
  '/:id',
  authenticateToken,
  authorizeRole('Manager'),
  validateSale,
  authorizeBranch,
  async (req, res) => {
    try {
      let id_ = req.params.id; // Extract ID
      let body = req.body; // Updated data

      // Find and update record
      const _update = await CreditModel.findByIdAndUpdate(id_, body, {
        new: true, // Return updated document
      });

      if (!_update) return res.status(404).json({ message: 'Sale not found' });

      res.status(200).json({
        message: 'Credit Sale Updated ',
        data: _update,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Credit sale Update failed', error: err.message });
    }
  }
);

// ===============================
// DELETE CREDIT SALE (WITH STOCK ROLLBACK)
// ===============================
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('Manager'),
  restoreStockOnDelete, // restores stock and attaches saleToDelete
  authorizeBranch,
  async (req, res) => {
    try {
      // 4️⃣ Delete the credit sale
      await CreditModel.findByIdAndDelete(req.saleToDelete._id);

      res.status(200).json({
        message: 'Credit sale deleted and stock restored successfully',
      });
    } catch (err) {
      res.status(500).json({
        message: 'Failed to delete credit sale',
        error: err.message,
      });
    }
  }
);

// Export router so it can be used in main app
module.exports = router;
