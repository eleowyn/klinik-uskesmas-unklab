const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['staff', 'doctor', 'nurse'], required: true },
});

module.exports = mongoose.model('Staff', StaffSchema);