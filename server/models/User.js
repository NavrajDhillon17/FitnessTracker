const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number },
  weight: { type: Number }, // in kg
  height: { type: Number }, // in cm
  fitnessGoal: {
    type: String,
    enum: ['lose_weight', 'build_muscle', 'improve_endurance', 'stay_active'],
    default: 'stay_active'
  },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);