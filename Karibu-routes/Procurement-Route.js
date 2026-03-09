// Import express
const express = require('express');

// Import Procurement model
const Procurement_Model = require('../Karibu-models/procurement-Model');
const {
  validateProcurement,
} = require('../Karibu-middleware/validateProcurement');
const {
  authenticateToken,
  authorizeRole,
} = require('../Karibu-middleware/userAuth');
const { authorizeBranch } = require('../Karibu-middleware/BranchMiddleware');

// Create router instance
const Router = express.Router();

// ===============================
// GET ALL PROCUREMENT RECORDS
// ===============================
Router.get('/', async (req, res) => {
  try {
    // Fetch all procurement records from database
    const _procurement = await Procurement_Model.find();

    res.status(200).json({
      message: 'Procurement Received',
      data: _procurement,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Procurement Not Received',
      error: err.message,
    });
  }
});

// ===============================
// GET SINGLE PROCUREMENT BY ID
// ===============================
Router.get('/:id', async (req, res) => {
  try {
    // Find procurement by MongoDB ID
    let sale = await Procurement_Model.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(200).json({
      message: 'Procurement Data collection was a success',
      data: sale,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Procurement not found',
      error: err.message,
    });
  }
});

// ===============================
// CREATE / UPDATE PROCUREMENT (STOCK MERGE)
// ===============================
Router.post(
  '/',
  authenticateToken,
  authorizeRole('Manager', 'Director'),
  validateProcurement,
  authorizeBranch,
  async (req, res) => {
    try {
      const { Produce_name, Produce_tonnage, Branch } = req.body;

      // Convert to number
      const tonnageNumber = Number(Produce_tonnage);

      if (isNaN(tonnageNumber) || tonnageNumber <= 0) {
        return res.status(400).json({
          message: 'Produce_tonnage must be a positive number',
        });
      }

      // ✅ Auto-update the Price collection so sales pages can fetch it
      await Price.findOneAndUpdate(
        { produce: Produce_name },
        { price: Number(Selling_price), date: Date_time || new Date() },
        { new: true, upsert: true }
      );

      // Check if produce already exists in the same branch
      let produce = await Procurement_Model.findOne({ Produce_name, Branch });

      if (produce) {
        // Merge stock
        produce.Produce_tonnage += tonnageNumber;
        await produce.save();

        return res.status(200).json({
          message: 'Stock updated successfully',
          data: produce,
        });
      }

      // Create new procurement record
      const _procurement = new Procurement_Model({
        ...req.body,
        Produce_tonnage: tonnageNumber,
      });

      await _procurement.save();

      res.status(201).json({
        message: 'Procurement Recorded Successfully',
        data: _procurement,
      });
    } catch (err) {
      res.status(500).json({
        message: 'Failed to Create Procurement Data',
        error: err.message,
      });
    }
  }
);

// ===============================
// UPDATE PROCUREMENT RECORD
// ===============================
Router.patch(
  '/:id',
  authenticateToken,
  authorizeRole('Manager', 'Director'),
  validateProcurement,
  authorizeBranch,
  async (req, res) => {
    try {
      const pro_id = req.params.id;
      const pro_body = req.body;

      const _Updated = await Procurement_Model.findByIdAndUpdate(
        pro_id,
        pro_body,
        { new: true }
      );

      if (!_Updated) {
        return res.status(404).json({
          message: 'Procurement record not found',
        });
      }

      res.status(200).json({
        message: 'Procurement Update successful',
        data: _Updated,
      });
    } catch (err) {
      res.status(500).json({
        message: 'Procurement Update Failed',
        error: err.message,
      });
    }
  }
);

// ===============================
// DELETE PROCUREMENT
// ===============================
Router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('Manager', 'Director'),
  authorizeBranch,
  async (req, res) => {
    try {
      const procurementId = req.params.id;

      if (!procurementId) {
        return res.status(400).json({
          message: 'Procurement ID required',
        });
      }

      const Produce_Deleted =
        await Procurement_Model.findByIdAndDelete(procurementId);

      if (!Produce_Deleted) {
        return res.status(404).json({
          message: 'Produce Not found',
        });
      }

      res.status(200).json({
        message: 'Procurement Deleted Successfully',
        data: Produce_Deleted,
      });
    } catch (err) {
      res.status(500).json({
        message: 'Procurement Deletion Failed',
        error: err.message,
      });
    }
  }
);

module.exports = Router;
