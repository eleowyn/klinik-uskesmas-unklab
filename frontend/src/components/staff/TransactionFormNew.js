import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';
import { getPatients, createTransaction } from '../../services/staffService';

const TransactionFormNew = () => {
  const { user } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('patientId');
  
  const [formData, setFormData] = useState({
    patient: patientId || '',
    prescription: '',
    items: [{ name: '', quantity: 1 }],
    notes: '',
  });
  
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!patientId) {
          const patientsData = await getPatients();
          setPatients(patientsData.data || []);
        }
        
        // For demo purposes, we'll use some mock prescriptions
        setPrescriptions([
          { _id: '1', diagnosis: 'Common Cold', datePrescribed: new Date() },
          { _id: '2', diagnosis: 'Hypertension', datePrescribed: new Date() },
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
        showAlert(err.message || 'Failed to fetch data', 'error');
      }
    };
    
    fetchData();
  }, [patientId, showAlert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = name === 'quantity' ? Number(value) : value;
    
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { name: '', quantity: 1 },
      ],
    });
  };

  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createTransaction(formData);
      showAlert('Transaction recorded successfully', 'success');
      navigate('/staff/transactions');
    } catch (err) {
      showAlert(err.message || 'Failed to record transaction', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Record New Transaction</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {!patientId && (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="patient">
              Patient
            </label>
            <select
              id="patient"
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a patient</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.fullName} ({patient.phoneNumber})
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="prescription">
            Prescription (Optional)
          </label>
          <select
            id="prescription"
            name="prescription"
            value={formData.prescription}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No prescription</option>
            {prescriptions.map(prescription => (
              <option key={prescription._id} value={prescription._id}>
                {prescription.diagnosis} - {new Date(prescription.datePrescribed).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition"
            >
              Add Item
            </button>
          </div>
          
          {formData.items.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm"
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="mb-6">
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
        
        <div className="flex justify-end space-x-4">
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
            {loading ? 'Processing...' : 'Record Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionFormNew;
