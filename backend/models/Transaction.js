const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  medicalRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord', required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], required: true, default: 'pending' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'insurance'], required: true },
  transactionDate: { type: Date, required: true, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);