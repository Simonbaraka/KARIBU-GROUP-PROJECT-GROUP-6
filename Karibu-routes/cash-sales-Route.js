const express = require('express');
const CashModel = require('../Karibu-models/cash_sales-Model');
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

const router = express.Router();

/**
 * ===============================
 * GET ALL CASH SALES
 * ===============================
 */
router.get('/', async (req, res) => {
  try {
    const sale = await CashModel.find();

    res.status(200).json({
      message: 'Sales Data collection was a success',
      data: sale,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Sales not found',
      error: err.message,
    });
  }
});

/**
 * ===============================
 * GET SINGLE CASH SALE BY ID
 * ===============================
 */
router.get('/:id', async (req, res) => {
  try {
    const sale = await CashModel.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json({
      message: 'Sales Data collection was a success',
      data: sale,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Sales not found',
      error: err.message,
    });
  }
});

/**
 * ===============================
 * CREATE NEW CASH SALE
 * ===============================
 */
router.post(
  '/',
  authenticateToken,
  authorizeRole('Sales Agent', 'Manager'),
  validateSale,
  checkStock,
  deductStock,
  async (req, res) => {
    try {
      const newSale = new CashModel(req.body);

      await newSale.save();

      res.status(201).json({
        message: 'Sales saved successfully',
        data: newSale,
      });
    } catch (err) {
      res.status(500).json({
        message: 'Failed to save sales data',
      });
    }
  }
);
/**
 * ===============================
 * UPDATE CASH SALE
 * ===============================
 */
router.patch(
  '/:id',
  authenticateToken,
  authorizeRole('Manager'), // only manager can edit sales
  validateSale,
  checkStock,
  deductStock, // if updating tonnage
  async (req, res) => {
    try {
      const id = req.params.id;

      const updated = await CashModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updated) {
        return res.status(404).json({
          message: 'Record not found',
        });
      }

      res.status(200).json({
        message: 'Updated Sales Successfully',
        data: updated,
      });
    } catch (err) {
      res.status(500).json({
        message: 'Update Failed',
        error: err.message,
      });
    }
  }
);

/**
 * ===============================
 * DELETE CASH SALE (WITH STOCK ROLLBACK)
 * ===============================
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('Director', 'Manager'), // Only privileged roles can delete
  restoreStockOnDelete,
  async (req, res) => {
    try {
      // Delete the sale after stock has been restored
      await CashModel.findByIdAndDelete(req.saleToDelete._id);

      res.status(200).json({
        success: true,
        message: 'Cash sale deleted and stock restored successfully',
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete sale',
        error: err.message,
      });
    }
  }
);
module.exports = router;
