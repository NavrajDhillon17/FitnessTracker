const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

// Weekly progress
router.get('/weekly', auth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const workouts = await Workout.find({
      user: req.user.id,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    const days = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days[key] = { date: key, workouts: 0, calories: 0, duration: 0 };
    }

    workouts.forEach(w => {
      const key = new Date(w.date).toISOString().split('T')[0];
      if (days[key]) {
        days[key].workouts++;
        days[key].calories += w.totalCalories || 0;
        days[key].duration += w.totalDuration || 0;
      }
    });

    res.json(Object.values(days));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Monthly progress
router.get('/monthly', auth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const workouts = await Workout.find({
      user: req.user.id,
      date: { $gte: thirtyDaysAgo }
    });

    const total = workouts.reduce((acc, w) => ({
      workouts: acc.workouts + 1,
      calories: acc.calories + (w.totalCalories || 0),
      duration: acc.duration + (w.totalDuration || 0)
    }), { workouts: 0, calories: 0, duration: 0 });

    res.json(total);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;