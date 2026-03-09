const CashModel = require('../Karibu-models/cash_sales-Model');
const ProcurementModel = require('../Karibu-models/procurement-Model');

/**
 * Middleware to delete a cash sale and restore stock
 */
async function restoreStockOnDelete(req, res, next) {
  try {
    const saleId = req.params.id;

    // 1️⃣ Find the sale first
    const sale = await CashModel.findById(saleId);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale record not found',
      });
    }

    const { Produce_name, Tonnage, Branch } = sale;

    // 2️⃣ Restore stock
    const produce = await ProcurementModel.findOne({
      Produce_name,
      Branch,
    });

    if (produce) {
      produce.Produce_tonnage += Number(Tonnage);
      await produce.save();
    }

    // 3️⃣ Attach sale to req object so route can delete it
    req.saleToDelete = sale;

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to restore stock before deletion',
      error: err.message,
    });
  }
}

module.exports = {
  restoreStockOnDelete,
};
