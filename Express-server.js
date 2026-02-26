const express = require('express');
require('dotenv').config();
const path = require('path');
const database = require('./Karibu-database/Karibu-MongoDB');
const cors = require('cors');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

//ROUTE IMPORTS
const CreditSalesRouter = require('./Karibu-routes/credit-sales-Route');
const cashSalesRouter = require('./Karibu-routes/cash-sales-Route');
const ProcurementRouter = require('./Karibu-routes/Procurement-Route');
const userRouter = require('./Karibu-routes/UserRoute');
const ReportRouter = require('./Karibu-routes/Report-Route');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// const swaggerDefinition = {
//   openapi: '3.1.0',
//   info: {
//     title: 'This is a KGL REST Documentation',
//     version: '1.0.0',
//     description:
//       'This is the documentation for the KGL REST API for the frontend app',
//   },
//   servers: [
//     {
//       url: 'http://localhost:3000',
//       description: 'Developer Tools',
//     },
//   ],
// };

// //Options for swagger -jsdoc
// const options = {
//   swaggerDefinition,
//   // apis: ['./Karibu-routes/*.js'],
// };

// swaggerSpec = swaggerJSDoc(options);
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//allo
app.use('/api/procurement', ProcurementRouter);
app.use('/api/cashsales', cashSalesRouter);
app.use('/api/creditsales', CreditSalesRouter);
app.use('/api/users', userRouter);
app.use('/api/reports', ReportRouter);

console.log('Cash Router:', cashSalesRouter);
console.log('Report Router:', ReportRouter);
console.log('Procurement Router:', ProcurementRouter);
console.log('Credit sales Router:', CreditSalesRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server running successfully ');
});
