const ProcurementModel = require('../Karibu-models/procurement-Model');

async function checkStock(req, res, next) {
  try {
    const { Produce_name, Tonnage, Branch } = req.body;

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

    // Validate required fields
    if (!Produce_name || !Tonnage) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (produce.Produce_tonnage < Tonnage) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available',
      });
    }

    req.produce = produce;

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Stock check failed',
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
