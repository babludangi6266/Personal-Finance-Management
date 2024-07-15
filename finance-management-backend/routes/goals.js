const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const authenticateToken = require('../middleware/auth');

// GET all goals
router.get('/total', authenticateToken, async (req, res) => {
    try {
      const totalGoals = await Goal.aggregate([
        { $match: { user: req.user.userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      console.log(totalGoals)
      res.json({ totalGoals: totalGoals[0]?.total || 0 });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// POST a new goal
router.post('/', authenticateToken, async (req, res) => {
  const goal = new Goal({
    title: req.body.title,
    amount: req.body.amount,
    date: req.body.date,
    user: req.user.userId
  });

  try {
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
