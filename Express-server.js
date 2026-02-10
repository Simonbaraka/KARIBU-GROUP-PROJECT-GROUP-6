const express = require('express');
const database = require('./Karibu-database/Karibu-MongoDB');

//ROUTE IMPORTS
const CreditSalesRouter = require('./Karibu-routes/credit-sales-Route');
const cashSalesRouter = require('./Karibu-routes/cash-sales-Route');
const ProcurementRouter = require('./Karibu-routes/Procurement-Route');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', cashSalesRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server running successfully ');
});
