const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const connectDB = require('../config/db');

async function migratePatientAddresses() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Get all patients
    const patients = await Patient.find();
    console.log('Total patients found:', patients.length);

    let updatedCount = 0;

    // Update each patient's address format
    for (const patient of patients) {
      // Only update if patient has the old address format
      if (patient.address && typeof patient.address === 'object') {
        const oldAddress = patient.address;
        // Combine the old address fields into a single string
        const newAddress = [
          oldAddress.street,
          oldAddress.city,
          oldAddress.state,
          oldAddress.zipCode
        ].filter(Boolean).join(', ');

        // Update the patient with the new address format
        await Patient.findByIdAndUpdate(patient._id, {
          $set: { address: newAddress }
        });

        updatedCount++;
        console.log(`Updated address for patient ${patient.fullName} (${patient._id})`);
      }
    }

    console.log('\nMigration Summary:');
    console.log(`Total patients: ${patients.length}`);
    console.log(`Updated addresses: ${updatedCount}`);
    console.log(`Skipped (already in new format): ${patients.length - updatedCount}`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error migrating patient addresses:', error);
    process.exit(1);
  }
}

migratePatientAddresses();
