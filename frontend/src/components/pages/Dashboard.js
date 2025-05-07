import { useState, useEffect } from 'react';
import patientService from '../services/patientService';
import medicalRecordService from '../services/medicalRecordService';
import prescriptionService from '../services/prescriptionService';
import transactionService from '../services/transactionService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    medicalRecords: 0,
    prescriptions: 0,
    transactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientData, recordData, prescriptionData, transactionData] = await Promise.all([
          patientService.getAll(),
          medicalRecordService.getAll(),
          prescriptionService.getAll(),
          transactionService.getAll(),
        ]);
        setStats({
          patients: patientData.length,
          medicalRecords: recordData.length,
          prescriptions: prescriptionData.length,
          transactions: transactionData.length,
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="flex-1 p-6 ml-0 md:ml-64">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Patients</h2>
          <p className="text-3xl text-blue-600">{stats.patients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Medical Records</h2>
          <p className="text-3xl text-green-600">{stats.medicalRecords}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Prescriptions</h2>
          <p className="text-3xl text-purple-600">{stats.prescriptions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Transactions</h2>
          <p className="text-3xl text-red-600">{stats.transactions}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;