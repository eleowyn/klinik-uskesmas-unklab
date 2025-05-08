const mongoose = require('mongoose');
const prescriptionService = require('../services/prescriptionService');

class PrescriptionController {
  async create(req, res) {
    try {
      const prescriptionData = req.body;
      const prescription = await prescriptionService.create(prescriptionData);
      res.status(201).json(prescription);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    console.log('Fetching all prescriptions...');
    try {
      const prescriptions = await prescriptionService.getAllWithDetails(); // Gunakan fungsi service yang melakukan populate
      console.log('Prescriptions data:', prescriptions);
      res.json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    console.log('Fetching prescription by ID:', req.params.id); // Tambahkan log
    try {
      const id = req.params.id;

      // Validasi ID
      if (!id || id === 'undefined') {
        return res.status(400).json({ message: 'Valid prescription ID is required' });
      }

      // Validasi format ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid prescription ID format' });
      }

      const prescription = await prescriptionService.getByIdWithDetails(id);
      if (!prescription) {
        console.log('Prescription not found with ID:', id); // Tambahkan log
        return res.status(404).json({ message: 'Prescription not found' });
      }
      res.json(prescription);
    } catch (error) {
      console.error('Error fetching prescription by ID:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async getByPatientId(req, res) {
    try {
      const prescriptions = await prescriptionService.getByPatientIdWithDetails(req.params.patientId); // Gunakan fungsi service yang melakukan populate
      res.json(prescriptions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const prescription = await prescriptionService.update(req.params.id, req.body);
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
      res.json(prescription);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    console.log('Deleting prescription with ID:', req.params.id); // Tambahkan log
    try {
      const prescription = await prescriptionService.deletePrescription(req.params.id);
      if (!prescription) {
        console.log('Prescription not found for deletion with ID:', req.params.id); // Tambahkan log
        return res.status(404).json({ message: 'Prescription not found' });
      }
      res.json({ message: 'Prescription deleted' });
    } catch (error) {
      console.error('Error deleting prescription:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new PrescriptionController();
