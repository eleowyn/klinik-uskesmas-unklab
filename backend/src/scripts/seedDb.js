const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Staff = require('../models/Staff');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/klinik_uskemask_unklab';
    console.log('\nAttempting to connect to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected Successfully\n');

    // Create a staff user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const staffUser = await User.create({
      email: 'staff@example.com',
      password: hashedPassword,
      role: 'staff'
    });
    
    console.log('Created staff user:', staffUser._id);

    // Create staff profile
    const staffProfile = await Staff.create({
      user: staffUser._id,
      fullName: 'John Staff',
      position: 'Admin Staff',
      phoneNumber: '1234567890',
      address: '123 Staff Street'
    });
    
    console.log('Created staff profile:', staffProfile._id);

    // Create a test patient user
    const patientUser = await User.create({
      email: 'patient@example.com',
      password: hashedPassword,
      role: 'patient'
    });
    
    console.log('Created patient user:', patientUser._id);

    // Create patient profile
    const patientProfile = await Patient.create({
      user: patientUser._id,
      fullName: 'Jane Patient',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'female',
      address: '456 Patient Avenue',
      phoneNumber: '0987654321',
      bloodType: 'O',
      allergies: ['Peanuts'],
      medicalHistory: ['Asthma']
    });
    
    console.log('Created patient profile:', patientProfile._id);

    // Create a test doctor user
    const doctorUser = await User.create({
      email: 'doctor@example.com',
      password: hashedPassword,
      role: 'doctor'
    });
    
    console.log('Created doctor user:', doctorUser._id);

    // Create doctor profile
    const doctorProfile = await Doctor.create({
      user: doctorUser._id,
      fullName: 'Dr. Smith',
      specialization: 'General Medicine',
      phoneNumber: '5555555555',
      address: '789 Doctor Road',
      licenseNumber: 'MED123456'
    });
    
    console.log('Created doctor profile:', doctorProfile._id);

    // Create test appointments
    const appointment = await mongoose.model('Appointment').create({
      patient: patientProfile._id,
      doctor: doctorProfile._id,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      time: '10:00 AM',
      reason: 'Regular checkup',
      status: 'scheduled'
    });
    
    console.log('Created test appointment:', appointment._id);

    // Create test transaction
    const transaction = await mongoose.model('Transaction').create({
      patient: patientProfile._id,
      staff: staffProfile._id,
      items: [{
        name: 'Consultation',
        quantity: 1,
        price: 100
      }],
      totalAmount: 100,
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      transactionDate: new Date()
    });
    
    console.log('Created test transaction:', transaction._id);

    console.log('\nDatabase seeding completed successfully');
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding database:', error);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
