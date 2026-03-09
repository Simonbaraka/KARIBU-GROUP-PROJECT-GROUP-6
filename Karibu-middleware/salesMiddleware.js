function validateSale(req, res, next) {
  const { Produce_name, Tonnage, Branch } = req.body;

  if (!Produce_name || !Tonnage || !Branch) {
    return res.status(400).json({
      success: false,
      message: 'Produce_name, Tonnage and Branch are required',
    });
  }

  const tonnageNumber = Number(Tonnage);

  if (isNaN(tonnageNumber) || tonnageNumber <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Tonnage must be a positive number',
    });
  }

  req.body.Tonnage = tonnageNumber;

  next();
}

module.exports = {
  validateSale,
};
