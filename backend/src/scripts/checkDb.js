const mongoose = require('mongoose');
const User = require('../models/User');
const Staff = require('../models/Staff');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Transaction = require('../models/Transaction');

const checkDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/klinik_uskemask_unklab';
    console.log('\nAttempting to connect to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected Successfully\n');
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name).join(', '), '\n');
    
    // Check document counts
    const userCount = await User.countDocuments();
    const staffCount = await Staff.countDocuments();
    const patientCount = await Patient.countDocuments();
    const doctorCount = await Doctor.countDocuments();
    const appointmentCount = await Appointment.countDocuments();
    const transactionCount = await Transaction.countDocuments();
    
    console.log('Collection counts:');
    console.log('- Users:', userCount);
    console.log('- Staff:', staffCount);
    console.log('- Patients:', patientCount);
    console.log('- Doctors:', doctorCount);
    console.log('- Appointments:', appointmentCount);
    console.log('- Transactions:', transactionCount, '\n');
    
    // Check for staff users
    const staffUsers = await User.find({ role: 'staff' });
    console.log('Staff users found:', staffUsers.length);
    if (staffUsers.length > 0) {
      console.log('Sample staff user:', {
        id: staffUsers[0]._id,
        email: staffUsers[0].email,
        role: staffUsers[0].role
      }, '\n');
      
      // Check if this staff user has a staff profile
      const staffProfile = await Staff.findOne({ user: staffUsers[0]._id });
      console.log('Staff profile exists:', !!staffProfile);
      if (staffProfile) {
        console.log('Sample staff profile:', {
          id: staffProfile._id,
          fullName: staffProfile.fullName,
          position: staffProfile.position
        }, '\n');
      }
    }
    
    // Check indexes
    console.log('Collection indexes:');
    const userIndexes = await User.collection.getIndexes();
    const staffIndexes = await Staff.collection.getIndexes();
    const patientIndexes = await Patient.collection.getIndexes();
    
    console.log('- User indexes:', Object.keys(userIndexes));
    console.log('- Staff indexes:', Object.keys(staffIndexes));
    console.log('- Patient indexes:', Object.keys(patientIndexes), '\n');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database check complete. Connection closed.');
    
  } catch (error) {
    console.error('Database check error:', error);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Run the check
checkDatabase();
