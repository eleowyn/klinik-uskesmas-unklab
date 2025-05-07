const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  visitDate: { type: Date, required: true, default: Date.now },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);