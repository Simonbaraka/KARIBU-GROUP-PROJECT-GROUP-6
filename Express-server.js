const express = require('express');
const { database } = require('./KARIBU-DATABASE/Karibu-MongoDB');

//ROUTE IMPORTS
const CreditSalesRouter = require('./KARIBU-ROUTES/credit-sales-Route');
const cashSalesRouter = require('./KARIBU-ROUTES/cash-sales-Route');
const ProcurementRouter = require('./KARIBU-ROUTES/Procurement-Route');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server running successfully ');
});
