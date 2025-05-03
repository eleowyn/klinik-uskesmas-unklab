const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  role: {
    type: String,
    required: true,
    default: 'staff'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return v.includes('staff');
      },
      message: props => `${props.value} must contain 'staff' to be a valid staff email!`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Staff', StaffSchema);
