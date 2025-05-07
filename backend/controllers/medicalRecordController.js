const medicalRecordService = require('../services/medicalRecordService');

class MedicalRecordController {
  async create(req, res) {
    try {
      const medicalRecordData = { ...req.body, staffId: req.user.id };
      const medicalRecord = await medicalRecordService.create(medicalRecordData);
      res.status(201).json(medicalRecord);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const medicalRecords = await medicalRecordService.findAll();
      res.json(medicalRecords);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const medicalRecord = await medicalRecordService.findById(req.params.id);
      if (!medicalRecord) {
        return res.status(404).json({ message: 'Medical record not found' });
      }
      res.json(medicalRecord);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getByPatientId(req, res) {
    try {
      const medicalRecords = await medicalRecordService.findByPatientId(req.params.patientId);
      res.json(medicalRecords);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const medicalRecord = await medicalRecordService.update(req.params.id, req.body);
      if (!medicalRecord) {
        return res.status(404).json({ message: 'Medical record not found' });
      }
      res.json(medicalRecord);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const medicalRecord = await medicalRecordService.delete(req.params.id);
      if (!medicalRecord) {
        return res.status(404).json({ message: 'Medical record not found' });
      }
      res.json({ message: 'Medical record deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MedicalRecordController();