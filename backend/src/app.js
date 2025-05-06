const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const staffRoutes = require('./routes/staffRoutes');
const patientRoutes = require('./routes/patientRoutes');
const clinicRoutes = require('./routes/clinicRoutes');

const { assignAllPatientsToDoctor } = require('./scripts/assignAllPatientsToDoctor');

const app = express();

// Connect to MongoDB
connectDB().then(async () => {
  // Automatically assign all patients to the doctor on server startup
  const doctorUserId = '6815f89dc2a3e80d7dd354c4'; // Replace with actual doctor user ID
  try {
    const assignedCount = await assignAllPatientsToDoctor(doctorUserId);
    console.log(`Auto-assigned ${assignedCount} patients to doctor ${doctorUserId} on startup.`);
  } catch (error) {
    console.error('Error auto-assigning patients to doctor on startup:', error);
  }
});

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/clinic', clinicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found'
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
