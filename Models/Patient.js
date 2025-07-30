const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: { type: String, required: true },
  age: Number,
  phone:{
    type: String,
    required: true,
    unique: true
  },
  weight: Number,
  fatPercent: Number,
  profileImage: String,
  report: String,
}, {
  timestamps: true
});

// Ensure email corresponds to a user with 'patient' role
patientSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('email')) {
    const User = require('./User');
    const user = await User.findOne({ email: this.email, role: 'patient' });
    if (!user) {
      throw new Error('Email must belong to a user with patient role');
    }
    this.userId = user._id;
  }
  next();
});

// Avoid OverwriteModelError in development
module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);