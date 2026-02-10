const express = require('express');
const path = require('path');
const database = require('./Karibu-database/Karibu-MongoDB');

//ROUTE IMPORTS
const CreditSalesRouter = require('./Karibu-routes/credit-sales-Route');
const cashSalesRouter = require('./Karibu-routes/cash-sales-Route');
const ProcurementRouter = require('./Karibu-routes/Procurement-Route');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// In your Express server
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/procurement', ProcurementRouter);
app.use('/api', cashSalesRouter);

console.log('Cash Router:', cashSalesRouter);
console.log('Procurement Router:', ProcurementRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server running successfully ');
});
