import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import transactionService from '../services/transactionService';

const TransactionList = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionService.getAll();
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch transactions');
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.delete(id);
        setTransactions(transactions.filter((transaction) => transaction._id !== id));
      } catch (err) {
        setError('Failed to delete transaction');
      }
    }
  };

  if (loading) return <div className="text-center mt-10 text-light-green-700">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-light-blue-700">Transactions</h2>
        <button
          onClick={() => navigate('/transactions/new')}
          className="bg-light-green-500 text-white px-4 py-2 rounded hover:bg-light-green-600 focus:outline-none focus:ring-2 focus:ring-light-green-400 focus:ring-offset-1"
        >
          Add New
        </button>
      </div>
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-light-green-100">
                <th className="border p-3 text-left text-light-blue-700">Patient</th>
                <th className="border p-3 text-left text-light-blue-700">Amount</th>
                <th className="border p-3 text-left text-light-blue-700">Payment Status</th>
                <th className="border p-3 text-left text-light-blue-700">Payment Method</th>
                <th className="border p-3 text-left text-light-blue-700">Transaction Date</th>
                <th className="border p-3 text-left text-light-blue-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-light-blue-100">
                  <td className="border p-3">{transaction.patientId.fullName}</td>
                  <td className="border p-3">${transaction.amount.toFixed(2)}</td>
                  <td className="border p-3 capitalize">{transaction.paymentStatus}</td>
                  <td className="border p-3 capitalize">{transaction.paymentMethod}</td>
                  <td className="border p-3">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                  <td className="border p-3 space-x-2">
                    <button
                      onClick={() => navigate(`/transactions/${transaction._id}`)}
                      className="bg-light-green-500 text-white px-2 py-1 rounded hover:bg-light-green-600 focus:outline-none focus:ring-2 focus:ring-light-green-400 focus:ring-offset-1"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/transactions/edit/${transaction._id}`)}
                      className="bg-light-blue-500 text-white px-2 py-1 rounded hover:bg-light-blue-600 focus:outline-none focus:ring-2 focus:ring-light-blue-400 focus:ring-offset-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
