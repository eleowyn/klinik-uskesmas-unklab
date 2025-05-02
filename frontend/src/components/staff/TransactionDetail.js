import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';
import { getTransactionDetails } from '../../services/staffService';

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await getTransactionDetails(id);
        setTransaction(data);
      } catch (err) {
        showAlert(err.message || 'Failed to fetch transaction details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id, showAlert]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!transaction) {
    return <div className="text-center text-gray-500 mt-10">Transaction not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>
      <div className="mb-4">
        <strong>Transaction ID:</strong> #{transaction._id.slice(-6).toUpperCase()}
      </div>
      <div className="mb-4">
        <strong>Patient:</strong> {transaction.patient?.fullName || 'N/A'}
      </div>
      <div className="mb-4">
        <strong>Amount:</strong> Rp{transaction.totalAmount?.toLocaleString() || '0'}
      </div>
      <div className="mb-4">
        <strong>Status:</strong> {transaction.paymentStatus || 'Unknown'}
      </div>
      <div className="mb-4">
        <strong>Date:</strong> {new Date(transaction.createdAt).toLocaleDateString()}
      </div>
      <div className="mb-4">
        <strong>Items:</strong>
        <ul className="list-disc list-inside">
          {transaction.items?.map((item, index) => (
            <li key={index}>
              {item.name} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <strong>Notes:</strong> {transaction.notes || '-'}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/staff/transactions')}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default TransactionDetail;
