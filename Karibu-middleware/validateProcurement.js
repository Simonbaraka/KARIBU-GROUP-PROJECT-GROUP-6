// Karibu-middleware/procurementMiddleware.js
function validateProcurement(req, res, next) {
  const { Produce_name, Produce_tonnage, Branch } = req.body;

  if (!Produce_name || !Produce_tonnage || !Branch) {
    return res.status(400).json({
      success: false,
      message: 'Produce_name, Produce_tonnage and Branch are required',
    });
  }

  const tonnageNumber = Number(Produce_tonnage);
  if (isNaN(tonnageNumber) || tonnageNumber <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Produce_tonnage must be a positive number',
    });
  }

  req.body.Produce_tonnage = tonnageNumber; // ensure number type
  next();
}

module.exports = { validateProcurement };
