const express = require('express');
const CashModel = require('../Karibu-models/cash_sales-Model');
const CreditModel = require('../Karibu-models/credit_sales-Model');
const Procurement_Model = require('../Karibu-models/procurement-Model');

const router = express.Router();

router.get('/sales-summary', async (req, res) => {
  try {
    const { startDate, endDate, Branch } = req.query;

    let dateFilter = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // 🔥 include entire end day

      dateFilter = {
        createdAt: {
          $gte: start,
          $lte: end,
        },
        Branch: Branch,
      };
    }
    console.log('Query:', req.query);
    console.log('Date Filter:', dateFilter);

    const cashSales = await CashModel.find(dateFilter);
    const creditSales = await CreditModel.find(dateFilter);
    const procurement = await Procurement_Model.find(dateFilter);

    const totalCashRevenue = cashSales.reduce(
      (sum, sale) => sum + sale.Amount_paid,
      0
    );
    const totalCreditRevenue = creditSales.reduce(
      (sum, sale) => sum + sale.Amount_Due,
      0
    );
    const totalRevenue = totalCashRevenue + totalCreditRevenue;

    const totalTonnage =
      cashSales.reduce((sum, sale) => sum + sale.Tonnage, 0) +
      creditSales.reduce((sum, sale) => sum + sale.Tonnage, 0);

    const procureTonnage = procurement.reduce(
      (sum, procure) => sum + procure.Produce_tonnage,
      0
    );

    const procureCost = procurement.reduce(
      (sum, procure) => sum + procure.Produce_Cost,
      0
    );

    res.json({
      totalRevenue,
      totalCashRevenue,
      totalCreditRevenue,
      totalTonnage,
      procureTonnage,
      procureCost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/sales-report', async (req, res) => {
  try {
    const { startDate, endDate, Branch } = req.query;
    let filter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // 🔥 include entire end day

      filter = {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      };
    }

    if (Branch && Branch !== 'Select Branch') {
      filter.Branch = Branch;
    }
    console.log('Query:', req.query);
    console.log('Date Filter:', filter);
    const cash = await CashModel.find(filter).sort({ createdAt: -1 }); //makes newest sales appear first

    const totalcash = cash.reduce((sum, amount) => {
      return sum + amount.Amount_paid;
    }, 0);

    const totalTonnage = cash.reduce((sum, tonage) => {
      return sum + tonage.Tonnage;
    }, 0);

    res.json({
      totalcash,
      totalTonnage,
      data: cash,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
