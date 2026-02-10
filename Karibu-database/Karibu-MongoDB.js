const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/Karibu_Groceries';

const database = mongoose
  .connect(URI)
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.log('Connection Error:', err);
  });

module.exports = database;
