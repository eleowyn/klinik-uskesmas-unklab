const transactionRepository = require('../repositories/transactionRepository');
const patientRepository = require('../repositories/patientRepository');
const staffRepository = require('../repositories/staffRepository');

class TransactionService {
  async create(transactionData) {
    if (!transactionData.patientId || !transactionData.staffId || !transactionData.amount) {
      throw new Error('Patient ID, Staff ID, and amount are required');
    }
    if (transactionData.amount <= 0) {
      throw new Error('Amount must be positive');
    }
    const patient = await patientRepository.findById(transactionData.patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    const staff = await staffRepository.findById(transactionData.staffId);
    if (!staff) {
      throw new Error('Staff not found');
    }
    return await transactionRepository.create(transactionData);
  }

  async findById(id) {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }

  async findByPatientId(patientId) {
    const patient = await patientRepository.findById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    return await transactionRepository.findByPatientId(patientId);
  }

  async findAll() {
    return await transactionRepository.findAll();
  }

  async update(id, updateData) {
    if (updateData.amount && updateData.amount <= 0) {
      throw new Error('Amount must be positive');
    }
    const transaction = await transactionRepository.update(id, updateData);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }

  async delete(id) {
    const transaction = await transactionRepository.delete(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }
}

module.exports = new TransactionService();