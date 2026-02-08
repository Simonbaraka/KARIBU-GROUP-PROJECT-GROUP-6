const express = require('express');
const { database } = require('.Karibu-Database/Karibu-MongoDB');

const router = require('./Karibu-Routes/cash-sales');
const app = express();

app.use(express.json());
const PORT = 3000;

app.listen(PORT, () => {
  console.log('Server running successfully ');
});
