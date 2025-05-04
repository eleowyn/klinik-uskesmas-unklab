const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const connectDB = require('../config/db');

async function fixPatientDoctorAssignments() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Get all doctors and patients
    const [doctors, patients] = await Promise.all([
      Doctor.find().lean(),
      Patient.find().lean()
    ]);

    console.log(`Found ${doctors.length} doctors and ${patients.length} patients`);

    if (doctors.length === 0) {
      console.error('No doctors found in the database');
      process.exit(1);
    }

    // For this example, we'll assign patients to the first doctor if they don't have any
    const defaultDoctor = doctors[0];
    console.log('Default doctor:', {
      id: defaultDoctor._id,
      name: defaultDoctor.fullName
    });

    let assignedCount = 0;
    let alreadyAssignedCount = 0;

    // Check and fix assignments for each patient
    for (const patient of patients) {
      if (!patient.doctors || patient.doctors.length === 0) {
        // Assign the patient to the default doctor
        await Patient.findByIdAndUpdate(patient._id, {
          $addToSet: { doctors: defaultDoctor._id }
        });
        assignedCount++;
        console.log(`Assigned patient ${patient.fullName} (${patient._id}) to doctor`);
      } else {
        alreadyAssignedCount++;
        console.log(`Patient ${patient.fullName} already has assigned doctors:`, patient.doctors);
      }
    }

    // Update the doctor's patients array
    const patientsWithDoctor = await Patient.find({ doctors: defaultDoctor._id });
    await Doctor.findByIdAndUpdate(defaultDoctor._id, {
      $set: { patients: patientsWithDoctor.map(p => p._id) }
    });

    console.log('\nAssignment Summary:');
    console.log(`Total patients: ${patients.length}`);
    console.log(`Newly assigned patients: ${assignedCount}`);
    console.log(`Previously assigned patients: ${alreadyAssignedCount}`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing patient-doctor assignments:', error);
    process.exit(1);
  }
}

fixPatientDoctorAssignments();
