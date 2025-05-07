const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  medicalHistory: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);