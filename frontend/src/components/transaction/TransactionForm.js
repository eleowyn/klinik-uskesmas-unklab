import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import transactionService from '../../services/transactionService';

const TransactionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: '',
    medicalRecordId: '',
    amount: '',
    paymentStatus: '',
    paymentMethod: '',
    transactionDate: new Date().toISOString().split('T')[0],
  });
  const [patients, setPatients] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, recordData] = await Promise.all([
          transactionService.getPatients(),
          transactionService.getMedicalRecords(),
        ]);
        setPatients(patientData);
        setMedicalRecords(recordData);

        if (id) {
          const transaction = await transactionService.getById(id);
          setFormData({
            patientId: transaction.patientId._id,
            medicalRecordId: transaction.medicalRecordId._id,
            amount: transaction.amount,
            paymentStatus: transaction.paymentStatus,
            paymentMethod: transaction.paymentMethod,
            transactionDate: new Date(transaction.transactionDate).toISOString().split('T')[0],
          });
        }
      } catch (err) {
        setError('Failed to fetch data');
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (id) {
        await transactionService.update(id, formData);
      } else {
        await transactionService.create(formData);
      }
      navigate('/transactions');
    } catch (err) {
      setError('Failed to save transaction');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Transaction' : 'Add Transaction'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Patient</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Medical Record</label>
          <select
            name="medicalRecordId"
            value={formData.medicalRecordId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Medical Record</option>
            {medicalRecords.map((record) => (
              <option key={record._id} value={record._id}>
                {record.patientId.fullName} - {record.diagnosis}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-gray-700">Payment Status</label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Method</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="insurance">Insurance</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Transaction Date</label>
          <input
            type="date"
            name="transactionDate"
            value={formData.transactionDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Saving...' : id ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;