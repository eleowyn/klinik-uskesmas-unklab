const Transaction = require('../models/Transaction');

const createTransaction = async (transactionData) => {
  try {
    console.log('Creating transaction with data:', transactionData);
    const transaction = new Transaction(transactionData);
    await transaction.save();
    console.log('Transaction created successfully:', transaction._id);
    const populatedTransaction = await transaction.populate([
      {
        path: 'patient',
        select: 'fullName phoneNumber email'
      },
      {
        path: 'staff',
        select: 'fullName position'
      },
      {
        path: 'prescription',
        select: 'diagnosis medications notes'
      }
    ]);
    return populatedTransaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

const findTransactionById = async (id) => {
  try {
    console.log('Finding transaction by ID:', id);
    const transaction = await Transaction.findById(id)
      .populate({
        path: 'patient',
        select: 'fullName phoneNumber email'
      })
      .populate({
        path: 'staff',
        select: 'fullName position'
      })
      .populate({
        path: 'prescription',
        select: 'diagnosis medications notes'
      });
    console.log('Transaction found:', transaction ? transaction._id : 'none');
    return transaction;
  } catch (error) {
    console.error('Error finding transaction by ID:', error);
    throw error;
  }
};

const findTransactionsByPatient = async (patientId) => {
  try {
    console.log('Finding transactions for patient:', patientId);
    const transactions = await Transaction.find({ patient: patientId })
      .populate({
        path: 'patient',
        select: 'fullName phoneNumber email'
      })
      .populate({
        path: 'staff',
        select: 'fullName position'
      })
      .populate({
        path: 'prescription',
        select: 'diagnosis medications notes'
      })
      .sort({ transactionDate: -1 });
    console.log('Found', transactions.length, 'transactions for patient');
    return transactions;
  } catch (error) {
    console.error('Error finding transactions by patient:', error);
    throw error;
  }
};

const findTransactionsByStaff = async (staffId) => {
  try {
    console.log('Finding transactions for staff:', staffId);
    const transactions = await Transaction.find({ staff: staffId })
      .populate({
        path: 'patient',
        select: 'fullName phoneNumber email'
      })
      .populate({
        path: 'staff',
        select: 'fullName position'
      })
      .populate({
        path: 'prescription',
        select: 'diagnosis medications notes'
      })
      .sort({ transactionDate: -1 });
    console.log('Found', transactions.length, 'transactions for staff');
    return transactions;
  } catch (error) {
    console.error('Error finding transactions by staff:', error);
    throw error;
  }
};

const updateTransaction = async (id, updateData) => {
  try {
    console.log('Updating transaction:', id, 'with data:', updateData);
    const transaction = await Transaction.findByIdAndUpdate(id, updateData, { new: true })
      .populate({
        path: 'patient',
        select: 'fullName phoneNumber email'
      })
      .populate({
        path: 'staff',
        select: 'fullName position'
      })
      .populate({
        path: 'prescription',
        select: 'diagnosis medications notes'
      });
    console.log('Transaction updated:', transaction ? transaction._id : 'none');
    return transaction;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

const deleteTransaction = async (id) => {
  try {
    console.log('Deleting transaction:', id);
    const transaction = await Transaction.findByIdAndDelete(id);
    console.log('Transaction deleted:', transaction ? transaction._id : 'none');
    return transaction;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

const getAllTransactions = async () => {
  try {
    console.log('Finding all transactions');
    const transactions = await Transaction.find({})
      .populate({
        path: 'patient',
        select: 'fullName phoneNumber email'
      })
      .populate({
        path: 'staff',
        select: 'fullName position'
      })
      .populate({
        path: 'prescription',
        select: 'diagnosis medications notes'
      })
      .sort({ transactionDate: -1 });
    console.log('Found', transactions.length, 'total transactions');
    return transactions;
  } catch (error) {
    console.error('Error finding all transactions:', error);
    throw error;
  }
};

module.exports = {
  createTransaction,
  findTransactionById,
  findTransactionsByPatient,
  findTransactionsByStaff,
  updateTransaction,
  deleteTransaction,
  getAllTransactions
};
