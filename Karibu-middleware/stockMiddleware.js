const ProcurementModel = require('../Karibu-models/procurement-Model');

async function checkStock(req, res, next) {
  try {
    const { Produce_name, Tonnage, Branch } = req.body;

    // Validate fields FIRST
    if (!Produce_name || !Tonnage || !Branch) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const produce = await ProcurementModel.findOne({
      Produce_name,
      Branch,
    });

    if (!produce) {
      return res.status(400).json({
        success: false,
        message: 'Produce not found in stock',
      });
    }

    if (Number(produce.Produce_tonnage) < Number(Tonnage)) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available',
      });
    }

    req.produce = produce;

    next();
  } catch (err) {
    console.error('CHECK STOCK ERROR:', err); // ⭐ IMPORTANT

    res.status(500).json({
      success: false,
      message: 'Stock check failed',
      error: err.message,
    });
  }
}

async function deductStock(req, res, next) {
  try {
    const produce = req.produce;
    const tonnage = req.body.Tonnage;

    produce.Produce_tonnage -= tonnage;

    await produce.save();

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
    });
  }
}

module.exports = {
  checkStock,
  deductStock,
};
