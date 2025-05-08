import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import transactionService from '../../services/transactionService';

const TransactionList = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('TransactionList: useEffect triggered'); // Tambahkan log ini
    const fetchTransactions = async () => {
      console.log('TransactionList: fetchTransactions function started'); // Tambahkan log ini
      try {
        const data = await transactionService.findAll();
        console.log('TransactionList: fetchTransactions successful, data:', data); // Tambahkan log ini
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        console.error('TransactionList: fetchTransactions failed, error:', err); // Pastikan ini ada
        setError('Failed to fetch transactions');
        setLoading(false);
      }
      console.log('TransactionList: fetchTransactions function finished'); // Tambahkan log ini
    };
    fetchTransactions();
    console.log('TransactionList: useEffect finished'); // Tambahkan log ini
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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
                <th className="border p-3 text-left text-sm font-semibold text-gray-700">Patient</th>
                <th className="border p-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="border p-3 text-left text-sm font-semibold text-gray-700">Payment Status</th>
                <th className="border p-3 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                <th className="border p-3 text-left text-sm font-semibold text-gray-700">Transaction Date</th>
                <th className="border p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="border p-3 text-sm text-gray-900">{transaction.patientId.fullName}</td>
                  <td className="border p-3 text-sm text-gray-900">${transaction.amount.toFixed(2)}</td>
                  <td className="border p-3 text-sm text-gray-900">
                    {transaction.paymentStatus.charAt(0).toUpperCase() + transaction.paymentStatus.slice(1)}
                  </td>
                  <td className="border p-3 text-sm text-gray-900">
                    {transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}
                  </td>
                  <td className="border p-3 text-sm text-gray-900">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="border p-3 space-x-2">
                    <button
                      onClick={() => {
                        console.log('Viewing transaction ID:', transaction._id);
                        navigate(`/transactions/${transaction._id}`)}}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          console.log('Editing transaction ID:', transaction._id);
                          navigate(`/transactions/edit/${transaction._id}`)}}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 text-xs"
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