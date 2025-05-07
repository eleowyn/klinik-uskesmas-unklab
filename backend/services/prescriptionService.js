const Prescription = require('../models/Prescription'); // Sesuaikan path

async function create(prescriptionData) {
  try {
    const prescription = await Prescription.create(prescriptionData);
    return prescription;
  } catch (error) {
    throw new Error(`Failed to create prescription: ${error.message}`);
  }
}

async function getAll() {
  try {
    const prescriptions = await Prescription.find();
    return prescriptions;
  } catch (error) {
    throw new Error(`Failed to fetch prescriptions: ${error.message}`);
  }
}

async function getAllWithDetails() {
  try {
    const prescriptions = await Prescription.find()
      .populate('medicalRecordId') // Populate medicalRecordId
      .populate('doctorId', 'username'); // Populate doctorId dan hanya ambil username
    return prescriptions;
  } catch (error) {
    throw new Error(`Failed to fetch prescriptions with details: ${error.message}`);
  }
}

async function getById(id) {
  console.log('Service: Fetching prescription by ID:', id); // Tambahkan log
  try {
    const prescription = await Prescription.findById(id)
      .populate('medicalRecordId')
      .populate('doctorId', 'username');
    return prescription;
  } catch (error) {
    throw new Error(`Failed to fetch prescription by ID: ${error.message}`);
  }
}

async function getByIdWithDetails(id) {
  try {
    const prescription = await Prescription.findById(id)
      .populate('medicalRecordId') // Populate medicalRecordId
      .populate('doctorId', 'username'); // Populate doctorId dan hanya ambil username
    return prescription;
  } catch (error) {
    throw new Error(`Failed to fetch prescription by ID with details: ${error.message}`);
  }
}

async function getByPatientId(patientId) {
  try {
    // Asumsi di model MedicalRecord ada field patientId yang mereferensikan Patient
    const prescriptions = await Prescription.find({ medicalRecordId: { $in: await mongoose.model('MedicalRecord').find({ patientId: patientId }).select('_id') } })
      .populate('medicalRecordId')
      .populate('doctorId', 'username');
    return prescriptions;
  } catch (error) {
    throw new Error(`Failed to fetch prescriptions by patient ID: ${error.message}`);
  }
}

async function getByPatientIdWithDetails(patientId) {
  try {
    // Asumsi di model MedicalRecord ada field patientId yang mereferensikan Patient
    const prescriptions = await Prescription.find({ medicalRecordId: { $in: await mongoose.model('MedicalRecord').find({ patientId: patientId }).select('_id') } })
      .populate('medicalRecordId', { populate: { path: 'patientId', select: 'fullName' } }) // Populate patientId di dalam medicalRecordId
      .populate('doctorId', 'username');
    return prescriptions;
  } catch (error) {
    throw new Error(`Failed to fetch prescriptions by patient ID with details: ${error.message}`);
  }
}

async function update(id, prescriptionData) {
  try {
    const prescription = await Prescription.findByIdAndUpdate(id, prescriptionData, { new: true });
    return prescription;
  } catch (error) {
    throw new Error(`Failed to update prescription: ${error.message}`);
  }
}

async function deletePrescription(id) {
  console.log('Service: Deleting prescription with ID:', id); // Tambahkan log
  try {
    const prescription = await Prescription.findByIdAndDelete(id);
    return prescription;
  } catch (error) {
    throw new Error(`Failed to delete prescription: ${error.message}`);
  }
}

module.exports = {
  create,
  getAll,
  getAllWithDetails,
  getById,
  getByIdWithDetails,
  getByPatientId,
  getByPatientIdWithDetails,
  update,
  deletePrescription, // Nama fungsi diubah
};