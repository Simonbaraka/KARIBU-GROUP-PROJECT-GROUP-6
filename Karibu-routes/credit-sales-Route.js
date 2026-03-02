const express = require('express');
const CreditModel = require('../Karibu-models/credit_sales-Model');
const Procurement_Model = require('../Karibu-models/procurement-Model');
const router = express.Router();

//Get All credit sales
router.get('/', async (req, res) => {
  try {
    const credit = await CreditModel.find();
    res.status(200).json({
      message: 'Credit details extracted successfully ',
      data: credit,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Credit sale extraction unsuccessful',
      error: err.message,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let sale = await CreditModel.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Not found' });
    }
    res
      .status(200)
      .json({ message: 'Sales Data collection was a success ', data: sale });
  } catch (err) {
    res.status(500).json({ message: 'Sales not found', error: err.message });
  }
});
//POST

router.post('/', async (req, res) => {
  try {
    const { Produce_name, Tonnage } = req.body;

    if (!Produce_name || !Tonnage) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const tonnageNumber = Number(Tonnage);

    const produce = await Procurement_Model.findOne({ Produce_name });

    if (!produce) {
      return res.status(400).json({ message: 'Produce not found in stock' });
    }

    if (produce.Produce_tonnage < tonnageNumber) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    produce.Produce_tonnage -= tonnageNumber;
    await produce.save();

    const credit = new CreditModel({
      ...req.body,
      Tonnage: tonnageNumber,
    });

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
//UPDATE/PATCH
router.patch('/:id', async (req, res) => {
  try {
    let id_ = req.params.id;
    let body = req.body;

    const _update = await CreditModel.findByIdAndUpdate(id_, body, {
      new: true,
    });
    res.status(200).json({ message: 'Credit Sale Updated ', data: _update });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Credit sale Update failed', error: err.message });
  }
});

//DELETING CREDIT SALES
router.delete('/:id', async (req, res) => {
  try {
    let _delete_id = req.params.id;
    const _deleted = await CreditModel.findByIdAndDelete(_delete_id);

    res.status(200).json({ message: 'Deleted successsfully', data: _deleted });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete.', error: err.message });
  }
});

module.exports = router;
