import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';
import { getTransactions, deleteTransaction } from '../../services/staffService';

const TransactionManagement = () => {
  const { showAlert } = useContext(AlertContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTransactions();
      if (!response) {
        throw new Error('No data received from server');
      }
      // Ensure all transaction dates are valid
      const formattedTransactions = response.map(transaction => ({
        ...transaction,
        createdAt: transaction.createdAt ? new Date(transaction.createdAt).toISOString() : null,
        date: transaction.date ? new Date(transaction.date).toISOString() : null
      }));
      setTransactions(formattedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      showAlert(err.message || 'Failed to fetch transactions', 'error');
      setTransactions([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction?._id) return;

    try {
      await deleteTransaction(selectedTransaction._id);
      showAlert('Transaction deleted successfully', 'success');
      await fetchTransactions();
    } catch (err) {
      showAlert(err.message || 'Failed to delete transaction', 'error');
    } finally {
      setShowDeleteModal(false);
      setSelectedTransaction(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymentStatus?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transaction.paymentStatus?.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transaction Management</h1>
          <p className="text-gray-600 mt-1">Manage patient transactions and billing</p>
        </div>
        <Link 
          to="/staff/transactions/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center"
        >
          <i className="fas fa-plus-circle mr-2"></i>
          Create New Transaction
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{transaction._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.patient?.fullName || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rp{transaction.totalAmount?.toLocaleString() || '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.paymentStatus)}`}>
                        {transaction.paymentStatus || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.createdAt 
                        ? new Date(transaction.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Date not available'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link 
                          to={`/staff/transactions/${transaction._id}`} 
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link 
                          to={`/staff/transactions/${transaction._id}/edit`} 
                          className="text-green-600 hover:text-green-900"
                          title="Edit Transaction"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(transaction)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Transaction"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="text-purple-600 hover:text-purple-900"
                          title="Print Invoice"
                        >
                          <i className="fas fa-print"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
