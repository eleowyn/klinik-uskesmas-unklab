const medicalRecordRepository = require('../repositories/medicalRecordRepository');
const patientRepository = require('../repositories/patientRepository');
const staffRepository = require('../repositories/staffRepository');

class MedicalRecordService {
  async create(medicalRecordData) {
    if (!medicalRecordData.patientId || !medicalRecordData.staffId || !medicalRecordData.diagnosis) {
      throw new Error('Patient ID, Staff ID, and diagnosis are required');
    }
    const patient = await patientRepository.findById(medicalRecordData.patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    const staff = await staffRepository.findById(medicalRecordData.staffId);
    if (!staff) {
      throw new Error('Staff not found');
    }
    return await medicalRecordRepository.create(medicalRecordData);
  }

  async findById(id) {
    const medicalRecord = await medicalRecordRepository.findById(id);
    if (!medicalRecord) {
      throw new Error('Medical record not found');
    }
    return medicalRecord;
  }

  async findByPatientId(patientId) {
    const patient = await patientRepository.findById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    return await medicalRecordRepository.findByPatientId(patientId);
  }

  async findAll() {
    return await medicalRecordRepository.findAll();
  }

  async update(id, updateData) {
    const medicalRecord = await medicalRecordRepository.update(id, updateData);
    if (!medicalRecord) {
      throw new Error('Medical record not found');
    }
    return medicalRecord;
  }

  async delete(id) {
    const medicalRecord = await medicalRecordRepository.delete(id);
    if (!medicalRecord) {
      throw new Error('Medical record not found');
    }
    return medicalRecord;
  }
}

module.exports = new MedicalRecordService();