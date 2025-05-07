const Patient = require('../models/Patient');

class PatientRepository {
  async findById(id) {
    return await Patient.findById(id);
  }

  async create(patientData) {
    const patient = new Patient(patientData);
    return await patient.save();
  }

  async update(id, updateData) {
    return await Patient.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Patient.findByIdAndDelete(id);
  }

  async findAll() {
    return await Patient.find();
  }
}

module.exports = new PatientRepository();