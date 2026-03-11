const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['weight', 'workouts_per_week', 'calories', 'distance', 'strength', 'custom'],
    required: true
  },
  targetValue: { type: Number, required: true },
  currentValue: { type: Number, default: 0 },
  unit: { type: String, default: '' },
  deadline: { type: Date },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);