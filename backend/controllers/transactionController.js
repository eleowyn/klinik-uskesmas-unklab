const mongoose = require('mongoose');
const transactionService = require('../services/transactionService');

class TransactionController {
  async create(req, res) {
    try {
      const transactionData = { ...req.body, staffId: req.user.id };
      const transaction = await transactionService.create(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  
  

  async getAll(req, res) {
    try {
      console.log('TransactionController.getAll() called');
      const transactions = await transactionService.findAll();
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // async getById(req, res) {
  //   try {
  //     const transaction = await transactionService.findById(req.params.id);
  //     if (!transaction) {
  //       return res.status(404).json({ message: 'Transaction not found' });
  //     }
  //     res.json(transaction);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // }

  async getById(req, res) {
    try {
      const id = req.params.id;
      
      // Validasi ID
      if (!id || id === 'undefined') {
        return res.status(400).json({ message: 'Valid transaction ID is required' });
      }
      
      // Validasi format ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid transaction ID format' });
      }
      
      const transaction = await transactionService.findById(id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async findById(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Valid transaction ID is required');
    }
    
    return await Transaction.findById(id)
      .populate('patientId', 'fullName')
      .populate('medicalRecordId', 'diagnosis');
  }

  async getByPatientId(req, res) {
    try {
      const transactions = await transactionService.findByPatientId(req.params.patientId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const transaction = await transactionService.update(req.params.id, req.body);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const transaction = await transactionService.delete(req.params.id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.json({ message: 'Transaction deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new TransactionController();
