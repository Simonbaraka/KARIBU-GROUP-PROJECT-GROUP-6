const express = require('express');
const CashModel = require('../Karibu-models/cash_sales-Model');
const CreditModel = require('../Karibu-models/credit_sales-Model');
const { authorizeBranch } = require('../middleware/branch-middleware'); // your branch middleware
const router = express.Router();

// ✅ Protect route and attach branch from JWT
router.post('/sales-report', authorizeBranch, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Get branch from middleware/JWT
    const branch = req.user.branch;

    let filter = { Branch: branch }; // Only allow manager's branch

    // Date filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    const cashSales = await CashModel.find(filter);
    const creditSales = await CreditModel.find(filter);

    const formattedCash = cashSales.map((sale) => ({
      ...sale._doc,
      saleType: 'Cash',
    }));
    const formattedCredit = creditSales.map((sale) => ({
      ...sale._doc,
      saleType: 'Credit',
    }));

    const allSales = [...formattedCash, ...formattedCredit];
    allSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ data: allSales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
