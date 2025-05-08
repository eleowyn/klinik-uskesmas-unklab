const Transaction = require('../models/Transaction');

class TransactionRepository {
  async findById(id) {
    return await Transaction.findById(id)
      .populate('patientId', 'fullName') // Populate patientId dan ambil fullName
      .populate('medicalRecordId', 'diagnosis'); // Populate medicalRecordId dan ambil diagnosis
  }

  async findByPatientId(patientId) {
    return await Transaction.find({ patientId });
  }

  async create(transactionData) {
    const transaction = new Transaction(transactionData);
    return await transaction.save();
  }

  async update(id, updateData) {
    return await Transaction.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Transaction.findByIdAndDelete(id);
  }

  // In TransactionRepository.js
  async findAll() {
    console.log('TransactionRepository: findAll() called');
    try {
      const transactions = await Transaction.find();
      console.log('TransactionRepository: findAll() result:', transactions);
      return transactions;
    } catch (error) {
      console.error('TransactionRepository: findAll() error:', error);
      throw error;
    }
  }
}

module.exports = new TransactionRepository();