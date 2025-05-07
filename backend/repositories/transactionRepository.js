const Transaction = require('../models/Transaction');

class TransactionRepository {
  async findById(id) {
    return await Transaction.findById(id);
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

  async findAll() {
    return await Transaction.find();
  }
}

module.exports = new TransactionRepository();