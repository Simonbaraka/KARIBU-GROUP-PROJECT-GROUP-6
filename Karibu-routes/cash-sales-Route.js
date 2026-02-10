const express = require('express');
const CashModel = require('../Karibu-models/cash_sales-Model');

const router = express.Router();

router.get('/cashsales', async (req, res) => {
  try {
    let sale = await CashModel.find();
    res
      .status(200)
      .json({ message: 'Sales Data collection was a success ', data: sale });
  } catch (err) {
    res.status(500).json({ message: 'Sales not found', error: err.message });
  }
});

router.post('/cashsales', async (req, res) => {
  try {
    let newRecord = new CashModel(req.body);

    await newRecord.save();
    res
      .status(200)
      .json({ message: 'Sales saved successfully', data: newRecord });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to save sales data ', error: err.message });
  }
});

router.patch('/cashsales/:id', async (req, res) => {
  try {
    const id = req.body.id;
    const updated = await CashModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: 'Updated Sales Successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Update Failed', error: err.message });
  }
});

router.delete('/cashsales/:id', async (req, res) => {
  try {
    let id_ = req.params.id;

    const delete_data = await CashModel.findByIdAndDelete(id_);

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
