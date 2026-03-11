const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

// GET all workouts for user
router.get('/', auth, async (req, res) => {
  try {
    const { limit = 20, page = 1, startDate, endDate } = req.query;
    const query = { user: req.user.id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const workouts = await Workout.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Workout.countDocuments(query);
    res.json({ workouts, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET single workout
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user.id });
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create workout
router.post('/', auth, async (req, res) => {
  try {
    const workout = new Workout({ ...req.body, user: req.user.id });
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT update workout
router.put('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET stats
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const stats = await Workout.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalCalories: { $sum: '$totalCalories' },
          totalDuration: { $sum: '$totalDuration' },
          avgCalories: { $avg: '$totalCalories' },
          avgDuration: { $avg: '$totalDuration' }
        }
      }
    ]);
    res.json(stats[0] || {});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;