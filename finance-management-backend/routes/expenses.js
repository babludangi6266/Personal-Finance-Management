// routes/expenses.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const authenticateToken = require('../middleware/auth');

// GET all expenses
router.get('/total', authenticateToken, async (req, res) => {
  try {
    const totalExpenses = await Expense.aggregate([
      { $match: { user: req.user.userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    console.log(totalExpenses)
    res.json({ totalExpenses: totalExpenses[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST a new expense
router.post('/', authenticateToken, async (req, res) => {
  const expense = new Expense({
    title: req.body.title,
    amount: req.body.amount,
    date: req.body.date,
    user: req.user.userId
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
