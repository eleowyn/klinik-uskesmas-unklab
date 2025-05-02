const mongoose = require('mongoose');

const ClinicInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'KLINIK USKESMAS UNKLAB',
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumbers: {
    type: [String],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  operatingHours: {
    type: Map,
    of: String, // Opening and closing times for each day
    required: true,
  },
  services: {
    type: [String],
    required: true,
  },
  aboutUs: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  vision: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ClinicInfo', ClinicInfoSchema);