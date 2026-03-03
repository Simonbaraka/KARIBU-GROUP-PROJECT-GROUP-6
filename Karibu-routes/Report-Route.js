const express = require('express');
const CashModel = require('../Karibu-models/cash_sales-Model');
const CreditModel = require('../Karibu-models/credit_sales-Model');
const Procurement_Model = require('../Karibu-models/procurement-Model');

const router = express.Router();

/**
 * ==========================================
 * SALES SUMMARY (Revenue + Tonnage Overview)
 * ==========================================
 */
router.get('/sales-summary', async (req, res) => {
  try {
    const { startDate, endDate, Branch } = req.query;

    let filter = {};

    // 📅 Date filter (applies to ALL collections)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: start, $lte: end };
    }

    // 🏢 Branch filter
    if (Branch && Branch !== 'Select branch') {
      filter.Branch = Branch;
    }

    // Fetch filtered data
    const cashSales = await CashModel.find(filter);
    const creditSales = await CreditModel.find(filter);
    const procurement = await Procurement_Model.find(filter);

    // 💰 Revenue
    const totalCashRevenue = cashSales.reduce(
      (sum, sale) => sum + (sale.Amount_paid || 0),
      0
    );

    const totalCreditRevenue = creditSales.reduce(
      (sum, sale) => sum + (sale.Amount_Due || 0),
      0
    );

    const totalRevenue = totalCashRevenue + totalCreditRevenue;

    // 📦 Sales tonnage
    const totalTonnage =
      cashSales.reduce((sum, sale) => sum + (sale.Tonnage || 0), 0) +
      creditSales.reduce((sum, sale) => sum + (sale.Tonnage || 0), 0);

    // 🏭 Procurement totals (ONLY within date range)
    const procureTonnage = procurement.reduce(
      (sum, item) => sum + (item.Produce_tonnage || 0),
      0
    );

    const procureCost = procurement.reduce(
      (sum, item) => sum + (item.Produce_Cost || 0),
      0
    );

    // 📊 Gross Profit Calculation
    const grossProfit = totalRevenue - procureCost;

    res.json({
      totalRevenue,
      totalCashRevenue,
      totalCreditRevenue,
      totalTonnage,
      procureTonnage,
      procureCost,
      grossProfit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * ==========================================
 * SALES REPORT (Detailed Cash or Credit)
 * ==========================================
 */
router.get('/sales-report', async (req, res) => {
  try {
    const { startDate, endDate, Branch, ReportType } = req.query;

    let filter = {};

    // 📅 Date filtering
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: start, $lte: end };
    }

    // 🏢 Branch filtering
    if (Branch && Branch !== 'Select branch') {
      filter.Branch = Branch;
    }

    let salesData = [];

    // 📊 Select report type
    if (ReportType === 'Credit') {
      salesData = await CreditModel.find(filter).sort({ createdAt: -1 });
    } else {
      // Default to Cash
      salesData = await CashModel.find(filter).sort({ createdAt: -1 });
    }

    // 💰 Calculate totals safely
    const totalAmount = salesData.reduce(
      (sum, sale) => sum + (sale.Amount_paid || sale.Amount_Due || 0),
      0
    );

    const totalTonnage = salesData.reduce(
      (sum, sale) => sum + (sale.Tonnage || 0),
      0
    );

    res.json({
      totalAmount,
      totalTonnage,
      data: salesData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
