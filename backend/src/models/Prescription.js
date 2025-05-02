const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  medications: [
    {
      name: {
        type: String,
        required: true,
      },
      dosage: {
        type: String,
        required: true,
      },
      frequency: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
      instructions: {
        type: String,
      },
    },
  ],
  diagnosis: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  datePrescribed: {
    type: Date,
    default: Date.now,
  },
  isFulfilled: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);