const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
    default: 'other'
  },
  sets: { type: Number },
  reps: { type: Number },
  weight: { type: Number }, // in kg
  duration: { type: Number }, // in minutes
  distance: { type: Number }, // in km
  calories: { type: Number },
  notes: { type: String }
});

const WorkoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  exercises: [ExerciseSchema],
  totalDuration: { type: Number, default: 0 }, // in minutes
  totalCalories: { type: Number, default: 0 },
  mood: { type: String, enum: ['great', 'good', 'okay', 'tired', 'exhausted'], default: 'good' },
  notes: { type: String },
  completed: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Workout', WorkoutSchema);