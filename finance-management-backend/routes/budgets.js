const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const authenticateToken = require('../middleware/auth');

// GET all budgets
router.get('/total', authenticateToken, async (req, res) => {
    try {
      const totalBudget = await Budget.aggregate([
        { $match: { user: req.user.userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      res.json({ totalBudget: totalBudget[0]?.total || 0 });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
// POST a new budget
router.post('/', authenticateToken, async (req, res) => {
  const budget = new Budget({
    title: req.body.title,
    amount: req.body.amount,
    user: req.user.userId
  });

  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
