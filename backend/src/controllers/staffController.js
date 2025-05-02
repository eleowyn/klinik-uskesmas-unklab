const {
  getStaffProfile,
  getStaffById,
  getAllStaff,
  updateStaffProfile,
  createNewTransaction,
  getStaffTransactions,
  getTransactionDetails,
  updateTransactionDetails,
  deleteTransactionById,
  getPatientTransactions,
  getPatientDetails,
  getAllPatients,
  updatePatientDetails,
  createNewPatient,
  deletePatientById,
  getAppointmentDetails,
  getUpcomingAppointments,
  updateAppointmentDetails,
  createNewAppointment,
  deleteAppointmentById,
} = require('../services/staffService');
const { responseFormatter } = require('../utils/responseFormatter');

// Staff Profile Controllers
const getProfile = async (req, res, next) => {
  try {
    if (req.staffProfile) {
      return res.status(200).json(responseFormatter({
        status: 'success',
        data: req.staffProfile,
      }));
    }
    const staff = await getStaffProfile(req.user.id);
    res.status(200).json(responseFormatter({
      status: 'success',
      data: staff,
    }));
  } catch (err) {
    next(err);
  }
};

const getStaff = async (req, res, next) => {
  try {
    const staff = await getStaffById(req.params.id);
    res.status(200).json(responseFormatter({
      status: 'success',
      data: staff,
    }));
  } catch (err) {
    next(err);
  }
};

const getStaffMembers = async (req, res, next) => {
  try {
    const staffMembers = await getAllStaff();
    res.status(200).json(responseFormatter({
      status: 'success',
      data: staffMembers,
    }));
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const staffId = req.staffProfile ? req.staffProfile._id : req.user.id;
    const staff = await updateStaffProfile(staffId, req.body);
    res.status(200).json(responseFormatter({
      status: 'success',
      data: staff,
    }));
  } catch (err) {
    next(err);
  }
};

// Patient Controllers
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

const getPatient = async (req, res, next) => {
  try {
    const patient = await getPatientDetails(req.params.id);
    res.status(200).json(responseFormatter({
      status: 'success',
      data: patient,
    }));
  } catch (err) {
    next(err);
  }
};

const createPatient = async (req, res, next) => {
  try {
    const patient = await createNewPatient(req.body);
    res.status(201).json(responseFormatter({
      status: 'success',
      data: patient,
    }));
  } catch (err) {
    next(err);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const patient = await updatePatientDetails(req.params.id, req.body);
    res.status(200).json(responseFormatter({
      status: 'success',
      data: patient,
    }));
  } catch (err) {
    next(err);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const patient = await deletePatientById(req.params.id);
    res.status(200).json(responseFormatter({
      status: 'success',
      message: 'Patient deleted successfully',
      data: patient,
    }));
  } catch (err) {
    next(err);
  }
};

// Transaction Controllers
const createTransaction = async (req, res, next) => {
  try {
    const staffId = req.staffProfile ? req.staffProfile._id : req.user.id;
    const transaction = await createNewTransaction({
      ...req.body,
      staff: staffId,
    });
    res.status(201).json(responseFormatter({
      status: 'success',
      data: transaction,
    }));
  } catch (err) {
    next(err);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const staffId = req.staffProfile ? req.staffProfile._id : req.user.id;
    const transactions = await getStaffTransactions(staffId);
    res.status(200).json(responseFormatter({
      status: 'success',
      data: transactions,
    }));
  } catch (err) {
    next(err);
  }
};

const getTransaction = async (req, res, next) => {
  try {
    const transaction = await getTransactionDetails(req.params.id);
    res.status(200).json(responseFormatter({
      status: 'success',
      data: transaction,
    }));
  } catch (err) {
    next(err);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await updateTransactionDetails(req.params.id, req.body);
    res.status(200).json(responseFormatter({
      status: 'success',
      data: transaction,
    }));
  } catch (err) {
    next(err);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await deleteTransactionById(req.params.id);
    res.status(200).json(responseFormatter({
      status: 'success',
      message: 'Transaction deleted successfully',
      data: transaction,
    }));
  } catch (err) {
    next(err);
  }
};

const getPatientTransactionHistory = async (req, res, next) => {
  try {
    const transactions = await getPatientTransactions(req.params.patientId);
    res.status(200).json(responseFormatter({
      status: 'success',
      data: transactions,
    }));
  } catch (err) {
    next(err);
  }
};

// Appointment Controllers
const getAppointment = async (req, res, next) => {
  try {
    const appointment = await getAppointmentDetails(req.params.id);
    res.status(200).json(responseFormatter({
      status: 'success',
      data: appointment,
    }));
  } catch (err) {
    next(err);
  }
};

const createAppointment = async (req, res, next) => {
  try {
    const appointment = await createNewAppointment(req.body);
    res.status(201).json(responseFormatter({
      status: 'success',
      data: appointment,
    }));
  } catch (err) {
    next(err);
  }
};

const fetchUpcomingAppointments = async (req, res, next) => {
  try {
    const appointments = await getUpcomingAppointments();
    res.status(200).json(responseFormatter({
      status: 'success',
      data: appointments,
    }));
  } catch (err) {
    next(err);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await updateAppointmentDetails(req.params.id, req.body);
    res.status(200).json(responseFormatter({
      status: 'success',
      data: appointment,
    }));
  } catch (err) {
    next(err);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await deleteAppointmentById(req.params.id);
    res.status(200).json(responseFormatter({
      status: 'success',
      message: 'Appointment deleted successfully',
      data: appointment,
    }));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  getStaff,
  getStaffMembers,
  updateProfile,
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getPatientTransactionHistory,
  getPatient,
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
  getAppointment,
  createAppointment,
  fetchUpcomingAppointments,
  updateAppointment,
  deleteAppointment,
};
