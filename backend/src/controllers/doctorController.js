const {
    getDoctorProfile,
    getDoctorById,
    getAllDoctors,
    updateDoctorProfile,
    createNewPrescription,
    getDoctorPrescriptions,
    getPrescriptionDetails,
    updatePrescriptionDetails,
  } = require('../services/doctorService');
  const { responseFormatter } = require('../utils/responseFormatter');
  
  const getProfile = async (req, res, next) => {
    try {
      const doctor = await getDoctorProfile(req.user.id);
      
      if (!doctor) {
        return res.status(404).json(responseFormatter({
          status: 'error',
          message: 'Doctor profile not found',
        }));
      }
      
      res.status(200).json(responseFormatter({
        status: 'success',
        data: doctor,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const getDoctor = async (req, res, next) => {
    try {
      const doctor = await getDoctorById(req.params.id);
      
      if (!doctor) {
        return res.status(404).json(responseFormatter({
          status: 'error',
          message: 'Doctor not found',
        }));
      }
      
      res.status(200).json(responseFormatter({
        status: 'success',
        data: doctor,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const getDoctors = async (req, res, next) => {
    try {
      const doctors = await getAllDoctors();
      
      res.status(200).json(responseFormatter({
        status: 'success',
        data: doctors,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const updateProfile = async (req, res, next) => {
    try {
      const doctor = await updateDoctorProfile(req.user.id, req.body);
      
      res.status(200).json(responseFormatter({
        status: 'success',
        data: doctor,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const createPrescription = async (req, res, next) => {
    try {
      const prescription = await createNewPrescription({
        ...req.body,
        doctor: req.user.id,
      });
      
      res.status(201).json(responseFormatter({
        status: 'success',
        data: prescription,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const getPrescriptions = async (req, res, next) => {
    try {
      const prescriptions = await getDoctorPrescriptions(req.user.id);
      
      res.status(200).json(responseFormatter({
        status: 'success',
        data: prescriptions,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const getPrescription = async (req, res, next) => {
    try {
      const prescription = await getPrescriptionDetails(req.params.id);
      
      if (!prescription) {
        return res.status(404).json(responseFormatter({
          status: 'error',
          message: 'Prescription not found',
        }));
      }
      
      // Check if the doctor owns this prescription
      if (prescription.doctor._id.toString() !== req.user.id) {
        return res.status(403).json(responseFormatter({
          status: 'error',
          message: 'Not authorized to access this prescription',
        }));
      }
      
      res.status(200).json(responseFormatter({
        status: 'success',
        data: prescription,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  const updatePrescription = async (req, res, next) => {
    try {
      const prescription = await updatePrescriptionDetails(req.params.id, req.body);
      
      if (!prescription) {
        return res.status(404).json(responseFormatter({
          status: 'error',
          message: 'Prescription not found',
        }));
      }
      
      // Check if the doctor owns this prescription
      if (prescription.doctor._id.toString() !== req.user.id) {
        return res.status(403).json(responseFormatter({
          status: 'error',
          message: 'Not authorized to update this prescription',
        }));
      }
      
      res.status(200).json(responseFormatter({
        status: 'success',
        data: prescription,
      }));
    } catch (err) {
      next(err);
    }
  };
  
  module.exports = {
    getProfile,
    getDoctor,
    getDoctors,
    updateProfile,
    createPrescription,
    getPrescriptions,
    getPrescription,
    updatePrescription,
  };