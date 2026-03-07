const express = require('express');
const router = express.Router();

const Price = require('../Karibu-models/Price-Model');

/* ===============================
CREATE OR UPDATE PRICE
================================ */

router.post('/', async (req, res) => {
  try {
    const { produce, price, date } = req.body;

    if (!produce || !price || !date) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const updatedPrice = await Price.findOneAndUpdate(
      { produce },

      { price, date },

      { new: true, upsert: true }
    );

    res.json({
      message: 'Price updated successfully',
      data: updatedPrice,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
});

/* ===============================
GET PRICE BY PRODUCE
================================ */

router.get('/:produce', async (req, res) => {
  try {
    const price = await Price.findOne({
      produce: req.params.produce,
    });

    if (!price) {
      return res.status(404).json({
        message: 'Price not found',
      });
    }

    res.json({
      data: price,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
});

module.exports = router;
