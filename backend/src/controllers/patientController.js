const {
    getPatientProfile,
    getPatientById,
    getAllPatients,
    updatePatientProfile,
  } = require('../services/patientService');
  const { responseFormatter } = require('../utils/responseFormatter');
  
  const getProfile = async (req, res, next) => {
    try {
      const patient = await getPatientProfile(req.user.id);
      
      if (!patient) {
        return res.status(404).json(responseFormatter({
          status: 'error',
          message: 'Patient profile not found',
        }));
      }
      
      res.status(200).json(responseFormatter({
        status: 'success',
        data: patient,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const getPatient = async (req, res, next) => {
    try {
      const patient = await getPatientById(req.params.id);
      
      if (!patient) {
        return res.status(404).json(responseFormatter({
          status: 'error',
          message: 'Patient not found',
        }));
      }
      
      res.status(200).json(responseFormatter({
        status: 'success',
        data: patient,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const getPatients = async (req, res, next) => {
    try {
      const patients = await getAllPatients();
      
      res.status(200).json(responseFormatter({
        status: 'success',
        data: patients,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const updateProfile = async (req, res, next) => {
    try {
      const patient = await updatePatientProfile(req.user.id, req.body);
      
      res.status(200).json(responseFormatter({
        status: 'success',
        data: patient,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  module.exports = {
    getProfile,
    getPatient,
    getPatients,
    updateProfile,
  };