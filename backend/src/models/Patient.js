const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
    default: 'unknown',
  },
  allergies: {
    type: String,
    default: '',
  },
  medicalHistory: {
    type: String,
    default: '',
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt timestamp before saving
PatientSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add index for better query performance
PatientSchema.index({ doctors: 1 });
PatientSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Patient', PatientSchema);
