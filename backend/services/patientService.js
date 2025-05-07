const patientRepository = require('../repositories/patientRepository');

class PatientService {
  async create(patientData) {
    if (!patientData.fullName || !patientData.dateOfBirth) {
      throw new Error('Name and date of birth are required');
    }
    return await patientRepository.create(patientData);
  }

  async findById(id) {
    const patient = await patientRepository.findById(id);
    if (!patient) {
      throw new Error('Patient not found');
    }
    return patient;
  }

  async findAll() {
    return await patientRepository.findAll();
  }

  async update(id, updateData) {
    const patient = await patientRepository.update(id, updateData);
    if (!patient) {
      throw new Error('Patient not found');
    }
    return patient;
  }

  async delete(id) {
    const patient = await patientRepository.delete(id);
    if (!patient) {
      throw new Error('Patient not found');
    }
    return patient;
  }
}

module.exports = new PatientService();