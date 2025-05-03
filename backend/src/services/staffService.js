const {
  findStaffByUserId,
  findStaffById,
  getAll,
  update,
} = require('../repositories/staffRepository');
const {
  createTransaction,
  findTransactionById,
  findTransactionsByStaff,
  updateTransaction,
  findTransactionsByPatient,
  getAllTransactions,
  deleteTransaction,
} = require('../repositories/transactionRepository');
const {
  findPatientById,
  findAllPatients,
  updatePatient,
  createPatient,
  deletePatient,
} = require('../repositories/patientRepository');
const {
  findAppointmentById,
  findUpcomingAppointments,
  updateAppointment,
  createAppointment,
  deleteAppointment,
} = require('../repositories/appointmentRepository');

// Staff Profile Services
const getStaffProfile = async (userId) => {
  try {
    console.log('Getting staff profile for user:', userId);
    const staff = await findStaffByUserId(userId);
    if (!staff) {
      console.error('Staff profile not found for user:', userId);
      throw new Error('Staff profile not found');
    }
    return staff;
  } catch (error) {
    console.error('Error in getStaffProfile:', error);
    throw error;
  }
};

const getStaffById = async (staffId) => {
  try {
    console.log('Getting staff by ID:', staffId);
    const staff = await findStaffById(staffId);
    if (!staff) {
      console.error('Staff not found with ID:', staffId);
      throw new Error('Staff not found');
    }
    return staff;
  } catch (error) {
    console.error('Error in getStaffById:', error);
    throw error;
  }
};

const getAllStaff = async () => {
  try {
    console.log('Getting all staff members');
    return await getAll();
  } catch (error) {
    console.error('Error in getAllStaff:', error);
    throw error;
  }
};

const updateStaffProfile = async (staffId, updateData) => {
  try {
    console.log('Updating staff profile:', staffId);
    const staff = await update(staffId, updateData);
    if (!staff) {
      console.error('Staff not found for update:', staffId);
      throw new Error('Staff not found');
    }
    return staff;
  } catch (error) {
    console.error('Error in updateStaffProfile:', error);
    throw error;
  }
};

// Patient Services
const getAllPatients = async () => {
  try {
    console.log('Getting all patients');
    const patients = await findAllPatients();
    return patients || [];
  } catch (error) {
    console.error('Error in getAllPatients:', error);
    throw error;
  }
};

const getPatientDetails = async (patientId) => {
  try {
    console.log('Getting patient details:', patientId);
    const patient = await findPatientById(patientId);
    if (!patient) {
      console.error('Patient not found:', patientId);
      throw new Error('Patient not found');
    }
    return patient;
  } catch (error) {
    console.error('Error in getPatientDetails:', error);
    throw error;
  }
};

const createNewPatient = async (patientData) => {
  try {
    console.log('Creating new patient');
    return await createPatient(patientData);
  } catch (error) {
    console.error('Error in createNewPatient:', error);
    throw error;
  }
};

const updatePatientDetails = async (patientId, updateData) => {
  try {
    console.log('Updating patient:', patientId);
    const patient = await updatePatient(patientId, updateData);
    if (!patient) {
      console.error('Patient not found for update:', patientId);
      throw new Error('Patient not found');
    }
    return patient;
  } catch (error) {
    console.error('Error in updatePatientDetails:', error);
    throw error;
  }
};

const deletePatientById = async (patientId) => {
  try {
    console.log('Deleting patient:', patientId);
    const patient = await deletePatient(patientId);
    if (!patient) {
      console.error('Patient not found for deletion:', patientId);
      throw new Error('Patient not found');
    }
    return patient;
  } catch (error) {
    console.error('Error in deletePatientById:', error);
    throw error;
  }
};

// Transaction Services
const createNewTransaction = async (transactionData) => {
  try {
    console.log('Creating new transaction');
    if (!transactionData.staff) {
      throw new Error('Staff ID is required');
    }
    return await createTransaction(transactionData);
  } catch (error) {
    console.error('Error in createNewTransaction:', error);
    if (error.name === 'ValidationError') {
      // Format Mongoose validation errors into a single message
      const messages = Object.values(error.errors).map(e => e.message).join('; ');
      throw new Error(`Validation Error: ${messages}`);
    }
    throw error;
  }
};

const getStaffTransactions = async (staffId) => {
  try {
    console.log('Getting transactions for staff:', staffId);
    const transactions = await findTransactionsByStaff(staffId);
    return transactions || [];
  } catch (error) {
    console.error('Error in getStaffTransactions:', error);
    throw error;
  }
};

const getTransactionDetails = async (transactionId) => {
  try {
    console.log('Getting transaction details:', transactionId);
    const transaction = await findTransactionById(transactionId);
    if (!transaction) {
      console.error('Transaction not found:', transactionId);
      throw new Error('Transaction not found');
    }
    return transaction;
  } catch (error) {
    console.error('Error in getTransactionDetails:', error);
    throw error;
  }
};

const updateTransactionDetails = async (transactionId, updateData) => {
  try {
    console.log('Updating transaction:', transactionId);
    const transaction = await updateTransaction(transactionId, updateData);
    if (!transaction) {
      console.error('Transaction not found for update:', transactionId);
      throw new Error('Transaction not found');
    }
    return transaction;
  } catch (error) {
    console.error('Error in updateTransactionDetails:', error);
    throw error;
  }
};

const deleteTransactionById = async (transactionId) => {
  try {
    console.log('Deleting transaction:', transactionId);
    const transaction = await deleteTransaction(transactionId);
    if (!transaction) {
      console.error('Transaction not found for deletion:', transactionId);
      throw new Error('Transaction not found');
    }
    return transaction;
  } catch (error) {
    console.error('Error in deleteTransactionById:', error);
    throw error;
  }
};

const getPatientTransactions = async (patientId) => {
  try {
    console.log('Getting transactions for patient:', patientId);
    const transactions = await findTransactionsByPatient(patientId);
    return transactions || [];
  } catch (error) {
    console.error('Error in getPatientTransactions:', error);
    throw error;
  }
};

// Appointment Services
const getAppointmentDetails = async (appointmentId) => {
  try {
    console.log('Getting appointment details:', appointmentId);
    const appointment = await findAppointmentById(appointmentId);
    if (!appointment) {
      console.error('Appointment not found:', appointmentId);
      throw new Error('Appointment not found');
    }
    return appointment;
  } catch (error) {
    console.error('Error in getAppointmentDetails:', error);
    throw error;
  }
};

const getUpcomingAppointments = async () => {
  try {
    console.log('Getting upcoming appointments');
    const appointments = await findUpcomingAppointments();
    return appointments || [];
  } catch (error) {
    console.error('Error in getUpcomingAppointments:', error);
    throw error;
  }
};

const createNewAppointment = async (appointmentData) => {
  try {
    console.log('Creating new appointment');
    return await createAppointment(appointmentData);
  } catch (error) {
    console.error('Error in createNewAppointment:', error);
    throw error;
  }
};

const updateAppointmentDetails = async (appointmentId, updateData) => {
  try {
    console.log('Updating appointment:', appointmentId);
    const appointment = await updateAppointment(appointmentId, updateData);
    if (!appointment) {
      console.error('Appointment not found for update:', appointmentId);
      throw new Error('Appointment not found');
    }
    return appointment;
  } catch (error) {
    console.error('Error in updateAppointmentDetails:', error);
    throw error;
  }
};

const deleteAppointmentById = async (appointmentId) => {
  try {
    console.log('Deleting appointment:', appointmentId);
    const appointment = await deleteAppointment(appointmentId);
    if (!appointment) {
      console.error('Appointment not found for deletion:', appointmentId);
      throw new Error('Appointment not found');
    }
    return appointment;
  } catch (error) {
    console.error('Error in deleteAppointmentById:', error);
    throw error;
  }
};

const getAllDoctors = async () => {
  try {
    // Assuming you have a `findAllDoctors()` in a repository
    return await findAllDoctors();
  } catch (error) {
    console.error('Error in getAllDoctors:', error);
    throw error;
  }
};

module.exports = {
  getAllDoctors,
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
};
