// routes/dashboard.js

const express = require('express');
const router = express.Router();
const CashSale = require('../Karibu-models/cash_sales-Model');

/*
========================================
GET DAILY SALES REVENUE
========================================
*/
router.get('/daily-revenue', async (req, res) => {
  try {
    const revenue = await CashSale.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          totalRevenue: { $sum: '$Amount_paid' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      status: 'success',
      data: revenue,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = router;
