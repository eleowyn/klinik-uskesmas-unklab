const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  position: {
    type: String,
    enum: ['receptionist', 'nurse', 'admin', 'other']
  },
  phone: {
    type: String
  },
  password: {
    type: String,
    required: false
  },
  username: String,
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  address: String,
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
  department: String,
  joinDate: {
    type: Date,
    default: Date.now
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  },
  permissions: [{
    type: String,
    enum: [
      'manage_patients',
      'manage_appointments',
      'manage_transactions',
      'view_reports',
      'manage_inventory',
      'manage_staff'
    ]
  }],
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }]
}, {
  timestamps: true
});

// Indexes
staffSchema.index({ user: 1 });
staffSchema.index({ status: 1 });

// Virtual for full name
staffSchema.virtual('name').get(function() {
  return this.fullName;
});

// Method to check if staff has permission
staffSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

// Method to check if staff is working at specific time
staffSchema.methods.isWorking = function(date) {
  const dayOfWeek = date.toLocaleLowerCase();
  const time = date.toLocaleTimeString('en-US', { hour12: false });
  
  if (!this.workingHours[dayOfWeek].isWorking) {
    return false;
  }

  const start = this.workingHours[dayOfWeek].start;
  const end = this.workingHours[dayOfWeek].end;

  return time >= start && time <= end;
};

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
