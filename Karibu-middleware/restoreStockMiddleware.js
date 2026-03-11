const CashModel = require('../Karibu-models/cash_sales-Model');
const CreditModel = require('../Karibu-models/credit_sales-Model');
const ProcurementModel = require('../Karibu-models/procurement-Model');

async function restoreStockOnDelete(req, res, next) {
  try {
    const saleId = req.params.id;

    const sale = await CashModel.findById(saleId);
    const credit = await CreditModel.findById(saleId);

    if (!sale && !credit) {
      return res.status(404).json({
        success: false,
        message: 'Sale record not found',
      });
    }

    const record = sale || credit;
    const { Produce_name, Tonnage, Branch } = record;

    const produce = await ProcurementModel.findOne({ Produce_name, Branch });

    if (produce) {
      // ✅ Use findByIdAndUpdate instead of produce.save()
      await ProcurementModel.findByIdAndUpdate(
        produce._id,
        { $inc: { Produce_tonnage: Number(Tonnage) } },
        { runValidators: false }
      );
    }

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

module.exports = { restoreStockOnDelete };
