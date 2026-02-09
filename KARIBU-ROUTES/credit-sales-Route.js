const express = require('express');
const CreditModel = require('../Karibu-Models/credit_sales');
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

//POST

router.post('/', async (req, res) => {
  try {
    let body = req.body;
    const _credit = new CreditModel(body);

    await _credit.save();
    res
      .status(201)
      .json({ message: 'Credit sale saved successfully', data: _credit });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to save data', error: err.message });
  }
});

//UPDATE/PATCH
router.patch('/:id', async (req, res) => {
  try {
    let _id = req.params.id;
    let body = req.params.body;

    const _update = await CreditModel.findByIdAndUpdate(_id, body, {
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
