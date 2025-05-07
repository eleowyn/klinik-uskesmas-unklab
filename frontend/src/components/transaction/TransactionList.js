import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import transactionService from '../../services/transactionService';

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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <button
          onClick={() => navigate('/transactions/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Patient</th>
                <th className="border p-3 text-left">Amount</th>
                <th className="border p-3 text-left">Payment Status</th>
                <th className="border p-3 text-left">Payment Method</th>
                <th className="border p-3 text-left">Transaction Date</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="border p-3">{transaction.patientId.fullName}</td>
                  <td className="border p-3">${transaction.amount.toFixed(2)}</td>
                  <td className="border p-3">
                    {transaction.paymentStatus.charAt(0).toUpperCase() + transaction.paymentStatus.slice(1)}
                  </td>
                  <td className="border p-3">
                    {transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}
                  </td>
                  <td className="border p-3">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="border p-3 space-x-2">
                    <button
                      onClick={() => navigate(`/transactions/${transaction._id}`)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/transactions/edit/${transaction._id}`)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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