const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: false,
    unique: false
  },
  fullName: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  no_sip: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  gender: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  workingHours: {
    monday: {
      start: String,
      end: String,
      isWorking: { type: Boolean, default: true }
    },
    tuesday: {
      start: String,
      end: String,
      isWorking: { type: Boolean, default: true }
    },
    wednesday: {
      start: String,
      end: String,
      isWorking: { type: Boolean, default: true }
    },
    thursday: {
      start: String,
      end: String,
      isWorking: { type: Boolean, default: true }
    },
    friday: {
      start: String,
      end: String,
      isWorking: { type: Boolean, default: true }
    },
    saturday: {
      start: String,
      end: String,
      isWorking: { type: Boolean, default: false }
    },
    sunday: {
      start: String,
      end: String,
      isWorking: { type: Boolean, default: false }
    }
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  experience: [{
    position: String,
    hospital: String,
    startYear: Number,
    endYear: Number,
    current: Boolean
  }],
  specialties: [String],
  languages: [String],
  bio: String,
  profileImage: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  prescriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  }]
}, {
  timestamps: true
});

doctorSchema.index({ user: 1 });
doctorSchema.index({ email: 1 });
doctorSchema.index({ no_sip: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ status: 1 });

// Virtual for full name
doctorSchema.virtual('name').get(function() {
  return this.fullName;
});

// Method to check if doctor is available at specific time
doctorSchema.methods.isAvailable = function(date) {
  const dayOfWeek = date.toLocaleLowerCase();
  const time = date.toLocaleTimeString('en-US', { hour12: false });
  
  if (!this.workingHours[dayOfWeek].isWorking) {
    return false;
  }

  const start = this.workingHours[dayOfWeek].start;
  const end = this.workingHours[dayOfWeek].end;

  return time >= start && time <= end;
};

// Method to get upcoming appointments
doctorSchema.methods.getUpcomingAppointments = function() {
  return this.model('Appointment')
    .find({
      doctor: this._id,
      date: { $gte: new Date() },
      status: { $ne: 'cancelled' }
    })
    .sort({ date: 1 })
    .populate('patient', 'fullName');
};

// Pre-save middleware
doctorSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Middleware to maintain bidirectional relationship with patients
doctorSchema.pre('save', async function(next) {
  if (this.isModified('patients')) {
    const Patient = mongoose.model('Patient');
    
    // Get the previous version of patients array if this is an existing document
    const oldPatients = this._id ? 
      (await Doctor.findById(this._id).select('patients')).patients : [];
    
    // Find patients to add and remove
    const patientsToAdd = this.patients.filter(p => !oldPatients.includes(p));
    const patientsToRemove = oldPatients.filter(p => !this.patients.includes(p));

    // Update the patients' doctors arrays
    await Promise.all([
      ...patientsToAdd.map(patientId => 
        Patient.findByIdAndUpdate(patientId, 
          { $addToSet: { doctors: this._id } }
        )
      ),
      ...patientsToRemove.map(patientId => 
        Patient.findByIdAndUpdate(patientId, 
          { $pull: { doctors: this._id } }
        )
      )
    ]);
  }
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
