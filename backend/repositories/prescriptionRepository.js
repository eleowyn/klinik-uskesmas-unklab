const Prescription = require('../models/Prescription');

class PrescriptionRepository {
  async findById(id) {
    return await Prescription.findById(id);
  }

  async findByPatientId(patientId) {
    return await Prescription.find({ patientId });
  }

  async create(prescriptionData) {
    const prescription = new Prescription(prescriptionData);
    return await prescription.save();
  }

  async update(id, updateData) {
    return await Prescription.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Prescription.findByIdAndDelete(id);
  }

  async findAll() {
    return await Prescription.find();
  }
}

module.exports = new PrescriptionRepository();