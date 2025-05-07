const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
  medicalRecordId: {
    type: Schema.Types.ObjectId,
    ref: 'MedicalRecord', // Pastikan nama model MedicalRecord sesuai
    required: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Staff', // Pastikan nama model Staff (atau Doctor) sesuai
    required: true
  },
  medications: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true }
    }
  ],
  issueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);