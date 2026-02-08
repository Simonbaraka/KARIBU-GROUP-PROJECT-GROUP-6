const express = require('express');
const { CasModel } = require('./KARIBU-MODELS/cash_sales');

const router = express.Router();

router.get('/Sales', async (req, res) => {
  try {
    let sale = await CashModel.find();
    res.status(200).json(sale);
  } catch (err) {
    res.status(500).json({ message: 'Sales not found', error: err.message });
  }
});

router.post('/Sales', async (req, res) => {
  try {
    let newRecord = new CashCales(req.body);

    await newRecord.save();
    res.status(200).json(newRecord);
  } catch (err) {}
});

router.patch('/Sales/:id', (req, res) => {
  console.log('Made update successfully ');
});

router.delete('/Sales', (req, res) => {
  console.log('Data deleted successfully ');
});

module.exports = { router };
