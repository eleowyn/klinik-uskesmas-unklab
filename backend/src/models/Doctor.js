const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  NO_SIP: {
    type: String,
    required: [true, 'NO_SIP is required for doctor registration'],
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
  },
  specialization: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  noTelp: {
    type: String,
    required: true,
  },
  schedule: {
    type: Map,
    of: [String],
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Doctor', DoctorSchema);
