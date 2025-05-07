const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000', // Ganti dengan origin frontend Anda
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Jika Anda menggunakan cookie atau otentikasi berbasis kredensial
  optionsSuccessStatus: 204, // Beberapa browser memerlukan ini untuk respons 204
};

app.use(cors(corsOptions));

const PORT = process.env.PORT 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`MongoDB connected. Server running on port http://localhost:${PORT}`))
  .catch(err => console.log('MongoDB connection error', err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/medical-records', require('./routes/medicalRecordRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

module.exports = app;