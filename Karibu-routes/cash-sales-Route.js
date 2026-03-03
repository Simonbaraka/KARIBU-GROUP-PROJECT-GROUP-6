const express = require('express');
const CashModel = require('../Karibu-models/cash_sales-Model');
const ProcurementModel = require('../Karibu-models/procurement-Model');

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
router.post('/', async (req, res) => {
  try {
    const { Produce_name, Tonnage, Branch } = req.body;

    // Validate required fields
    if (!Produce_name || !Tonnage || !Branch) {
      return res.status(400).json({
        message: 'Produce_name, Tonnage and Branch are required',
      });
    }

    const tonnageNumber = Number(Tonnage);

    if (isNaN(tonnageNumber) || tonnageNumber <= 0) {
      return res.status(400).json({
        message: 'Tonnage must be a positive number',
      });
    }

    // Find produce in procurement stock
    const produce = await ProcurementModel.findOne({
      Produce_name,
      Branch,
    });

    if (!produce) {
      return res.status(400).json({
        message: 'Produce not found in stock',
      });
    }

    // Check stock availability
    if (produce.Produce_tonnage < tonnageNumber) {
      return res.status(400).json({
        message: 'Not enough stock available',
      });
    }

    // Reduce stock
    produce.Produce_tonnage -= tonnageNumber;
    await produce.save();

    // Create new cash sale record
    const newRecord = new CashModel({
      ...req.body,
      Tonnage: tonnageNumber,
    });

    await newRecord.save();

    res.status(201).json({
      message: 'Sales saved successfully',
      data: newRecord,
    });
  } catch (err) {
    console.error('Error in /api/cashsales:', err);
    res.status(500).json({
      message: 'Failed to save sales data',
      error: err.message,
    });
  }
});

/**
 * ===============================
 * UPDATE CASH SALE
 * ===============================
 */
router.patch('/:id', async (req, res) => {
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
});

/**
 * ===============================
 * DELETE CASH SALE (WITH STOCK ROLLBACK)
 * ===============================
 */
router.delete('/:id', async (req, res) => {
  try {
    const id_ = req.params.id;

    // 1️⃣ Find sale first
    const sale = await CashModel.findById(id_);

    if (!sale) {
      return res.status(404).json({ message: 'Record Not found' });
    }

    const { Produce_name, Tonnage, Branch } = sale;

    // 2️⃣ Restore stock
    const produce = await ProcurementModel.findOne({
      Produce_name,
      Branch,
    });

    if (produce) {
      produce.Produce_tonnage += Number(Tonnage);
      await produce.save();
    }

    // 3️⃣ Delete sale
    await CashModel.findByIdAndDelete(id_);

    res.status(200).json({
      message: 'Cash sale deleted and stock restored successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to delete data',
      error: err.message,
    });
  }
});

module.exports = router;
