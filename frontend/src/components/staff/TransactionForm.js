import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';
import { getAllPatients, createTransaction, updateTransaction, getTransactionDetails } from '../../services/staffService';

const TransactionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    amount: '',
    type: 'payment',
    description: '',
    paymentMethod: 'cash',
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const patientsData = await getAllPatients();
        setPatients(patientsData);

        if (id) {
          const transactionData = await getTransactionDetails(id);
          setFormData({
            patientId: transactionData.patient._id,
            amount: transactionData.amount,
            type: transactionData.type,
            description: transactionData.description,
            paymentMethod: transactionData.paymentMethod,
            status: transactionData.status,
            notes: transactionData.notes || ''
          });
        }
      } catch (err) {
        showAlert(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, showAlert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        patient: formData.patientId,
        amount: parseFloat(formData.amount),
        type: formData.type,
        description: formData.description,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        notes: formData.notes
      };

      if (id) {
        await updateTransaction(id, data);
        showAlert('Transaction updated successfully', 'success');
      } else {
        await createTransaction(data);
        showAlert('Transaction created successfully', 'success');
      }
      navigate('/staff/transactions');
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Edit Transaction' : 'New Transaction'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="patientId">
              Patient *
            </label>
            <select
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="amount">
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="type">
              Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="payment">Payment</option>
              <option value="refund">Refund</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="paymentMethod">
              Payment Method *
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="insurance">Insurance</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="status">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="description">
              Description *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 mb-2" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/staff/transactions')}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {loading ? 'Saving...' : (id ? 'Update Transaction' : 'Create Transaction')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
