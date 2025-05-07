const MedicalRecord = require('../models/MedicalRecord');

class MedicalRecordRepository {
  async findById(id) {
    return await MedicalRecord.findById(id);
  }

  async findByPatientId(patientId) {
    return await MedicalRecord.find({ patientId });
  }

  async create(medicalRecordData) {
    const medicalRecord = new MedicalRecord(medicalRecordData);
    return await medicalRecord.save();
  }

  async update(id, updateData) {
    return await MedicalRecord.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await MedicalRecord.findByIdAndDelete(id);
  }

  async findAll() {
    return await MedicalRecord.find();
  }
}

module.exports = new MedicalRecordRepository();