import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import transactionService from '../services/transactionService';


const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await transactionService.getById(id);
        setTransaction(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch transaction');
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-light-green-700">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 font-semibold">{error}</div>;
  if (!transaction) return <div className="text-center mt-10">Transaction not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-light-blue-700">Transaction Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-light-green-700 font-semibold">Patient</label>
          <p className="text-gray-900">{transaction.patientId.fullName}</p>
        </div>
        <div>
          <label className="block text-light-green-700 font-semibold">Medical Record</label>
          <p className="text-gray-900">{transaction.medicalRecordId.diagnosis}</p>
        </div>
        <div>
          <label className="block text-light-green-700 font-semibold">Amount</label>
          <p className="text-gray-900">${transaction.amount.toFixed(2)}</p>
        </div>
        <div>
          <label className="block text-light-green-700 font-semibold">Payment Status</label>
          <p className="capitalize">{transaction.paymentStatus}</p>
        </div>
        <div>
          <label className="block text-light-green-700 font-semibold">Payment Method</label>
          <p className="capitalize">{transaction.paymentMethod}</p>
        </div>
        <div>
          <label className="block text-light-green-700 font-semibold">Transaction Date</label>
          <p className="text-gray-900">{new Date(transaction.transactionDate).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="block text-light-green-700 font-semibold">Created At</label>
          <p className="text-gray-900">{new Date(transaction.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => navigate(`/transactions/edit/${id}`)}
          className="bg-light-green-500 text-white px-4 py-2 rounded hover:bg-light-green-600 focus:outline-none focus:ring-2 focus:ring-light-green-400 focus:ring-offset-1"
        >
          Edit
        </button>
        <button
          onClick={() => navigate('/transactions')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default TransactionDetail;
