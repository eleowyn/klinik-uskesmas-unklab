const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
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
    type: String
  },
  phoneNumber: {
    type: String
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
  lastVisit: {
    type: Date,
    default: null
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

// Update timestamps before saving
PatientSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Update lastVisit when patient is modified
PatientSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastVisit = new Date();
  }
  next();
});

// Middleware to maintain bidirectional relationship with doctors
PatientSchema.pre('save', async function(next) {
  if (this.isModified('doctors')) {
    const Doctor = mongoose.model('Doctor');
    
    // Get the previous version of doctors array if this is an existing document
    const oldDoctors = this._id ? 
      (await Patient.findById(this._id).select('doctors')).doctors : [];
    
    // Find doctors to add and remove
    const doctorsToAdd = this.doctors.filter(d => !oldDoctors.includes(d));
    const doctorsToRemove = oldDoctors.filter(d => !this.doctors.includes(d));

    // Update the doctors' patients arrays
    await Promise.all([
      ...doctorsToAdd.map(doctorId => 
        Doctor.findByIdAndUpdate(doctorId, 
          { $addToSet: { patients: this._id } }
        )
      ),
      ...doctorsToRemove.map(doctorId => 
        Doctor.findByIdAndUpdate(doctorId, 
          { $pull: { patients: this._id } }
        )
      )
    ]);
  }
  next();
});

// Add indexes for better query performance
PatientSchema.index({ doctors: 1 });
PatientSchema.index({ user: 1 });  // Remove unique constraint
PatientSchema.index({ fullName: 'text' });

// Virtual for doctor count
PatientSchema.virtual('doctorCount').get(function() {
  return this.doctors ? this.doctors.length : 0;
});

// Ensure virtuals are included in JSON output
PatientSchema.set('toJSON', { virtuals: true });
PatientSchema.set('toObject', { virtuals: true });

// Add method to check if a doctor is associated with this patient
PatientSchema.methods.hasDoctor = function(doctorId) {
  return this.doctors.includes(doctorId);
};

// Add method to add a doctor
PatientSchema.methods.addDoctor = async function(doctorId) {
  if (!this.doctors.includes(doctorId)) {
    this.doctors.push(doctorId);
    await this.save();
  }
  return this;
};

// Add method to remove a doctor
PatientSchema.methods.removeDoctor = async function(doctorId) {
  this.doctors = this.doctors.filter(id => id.toString() !== doctorId.toString());
  await this.save();
  return this;
};

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;
