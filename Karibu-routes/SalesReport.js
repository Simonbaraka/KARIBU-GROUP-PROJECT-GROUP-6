const express = require('express');
const CashModel = require('../Karibu-models/cash_sales-Model');
const CreditModel = require('../Karibu-models/credit_sales-Model');

const router = express.Router();

router.post('/sales-report', async (req, res) => {
  try {
    const { startDate, endDate, Branch } = req.body;

    let filter = {};

    // ✅ Date Filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    // ✅ Branch Filter (separate — important)
    if (Branch) {
      filter.Branch = Branch;
    }

    // ✅ Always run queries (outside if block)
    const cashSales = await CashModel.find(filter);
    const creditSales = await CreditModel.find(filter);

    // ✅ Add saleType
    const formattedCash = cashSales.map((sale) => ({
      ...sale._doc,
      saleType: 'Cash',
    }));

    const formattedCredit = creditSales.map((sale) => ({
      ...sale._doc,
      saleType: 'Credit',
    }));

    // ✅ Merge
    const allSales = [...formattedCash, ...formattedCredit];

    // ✅ Sort newest first
    allSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ sales: allSales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
