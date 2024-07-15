// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGODB_URI;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
const usersRouter = require('./routes/users');
const expensesRouter = require('./routes/expenses');
const goalsRouter = require('./routes/goals');
const budgetsRouter = require('./routes/budgets');
app.use('/api/users', usersRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/budgets', budgetsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
