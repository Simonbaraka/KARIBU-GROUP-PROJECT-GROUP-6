const express = require('express');
const CashModel = require('../Karibu-models/cash_sales-Model');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let sale = await CashModel.find();
    res
      .status(200)
      .json({ message: 'Sales Data collection was a success ', data: sale });
  } catch (err) {
    res.status(500).json({ message: 'Sales not found', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    //console.log('DATA RECEIVED:', req.body);
    let newRecord = new CashModel(req.body);
    await newRecord.save();
    res
      .status(201)
      .json({ message: 'Sales saved successfully', data: newRecord });
  } catch (err) {
    console.error('Error in /api/cashsales:', err);
    res.status(500).json({ message: 'Failed to save sales data ' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await CashModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      res.status(404).json({
        message: 'Record not found',
      });
    }

    res
      .status(200)
      .json({ message: 'Updated Sales Successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Update Failed', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let id_ = req.params.id;

    const delete_data = await CashModel.findByIdAndDelete(id_);

    if (!delete_data) {
      res.status(404).json({ message: 'Record Not found' });
    }

    res
      .status(200)
      .json({ message: 'Data deleted successfully', data: delete_data });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete data', error: err.message });
  }
});

module.exports = router;
