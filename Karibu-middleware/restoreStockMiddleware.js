const CashModel = require('../Karibu-models/cash_sales-Model');
const CreditModel = require('../Karibu-models/credit_sales-Model');
const ProcurementModel = require('../Karibu-models/procurement-Model');

/**
 * Middleware to delete a cash sale and restore stock
 */
async function restoreStockOnDelete(req, res, next) {
  try {
    const saleId = req.params.id;

    // Find sale in both collections
    const sale = await CashModel.findById(saleId);
    const credit = await CreditModel.findById(saleId);

    if (!sale && !credit) {
      return res.status(404).json({
        success: false,
        message: 'Sale record not found',
      });
    }

    // Determine which sale exists
    const record = sale || credit;

    const { Produce_name, Tonnage, Branch } = record;

    // Restore stock
    const produce = await ProcurementModel.findOne({
      Produce_name,
      Branch,
    });

    if (produce) {
      produce.Produce_tonnage += Number(Tonnage);
      await produce.save();
    }

    // Attach correct sale record
    req.saleToDelete = record;

    next();
  } catch (err) {
    console.error('RESTOCK ERROR:', err);

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
