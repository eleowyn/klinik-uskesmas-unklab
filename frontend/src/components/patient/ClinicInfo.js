import React, { useState, useEffect } from 'react';
import api from '../../services/patientService';

const ClinicInfo = () => {
  const [clinicInfo, setClinicInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const res = await api.get('/api/clinic');
        setClinicInfo(res.data.data);
      } catch (err) {
        console.error('Error fetching clinic info:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClinicInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Clinic Information</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">{clinicInfo.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Contact Information</h3>
            <div className="space-y-2">
              <p><i className="fas fa-map-marker-alt text-blue-600 mr-2"></i> {clinicInfo.address}</p>
              <p><i className="fas fa-phone text-blue-600 mr-2"></i> {clinicInfo.phoneNumbers.join(', ')}</p>
              <p><i className="fas fa-envelope text-blue-600 mr-2"></i> {clinicInfo.email}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Operating Hours</h3>
            <ul className="space-y-1">
              {Object.entries(clinicInfo.operatingHours).map(([day, hours]) => (
                <li key={day} className="flex justify-between">
                  <span className="font-medium">{day}:</span>
                  <span>{hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Services Offered</h3>
          <div className="flex flex-wrap gap-2">
            {clinicInfo.services.map(service => (
              <span key={service} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {service}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">About Us</h3>
            <p className="text-gray-600">{clinicInfo.aboutUs}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Mission & Vision</h3>
            <div className="mb-4">
              <h4 className="font-medium text-gray-800">Mission</h4>
              <p className="text-gray-600">{clinicInfo.mission}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Vision</h4>
              <p className="text-gray-600">{clinicInfo.vision}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Map</h2>
        <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg">
          <p className="text-gray-500">Map of clinic location would be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;