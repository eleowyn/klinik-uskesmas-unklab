import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
            Welcome to KLINIK USKESMAS UNKLAB
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Providing quality healthcare services to the UNKLAB community and surrounding areas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-blue-600 text-4xl mb-4">
              <i className="fas fa-user-md"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Experienced Doctors</h3>
            <p className="text-gray-600">
              Our team of qualified doctors provide expert care in various specialties.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-blue-600 text-4xl mb-4">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Comprehensive Care</h3>
            <p className="text-gray-600">
              From general medicine to specialized treatments, we've got you covered.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-blue-600 text-4xl mb-4">
              <i className="fas fa-clock"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Convenient Hours</h3>
            <p className="text-gray-600">
              Open 6 days a week to serve your healthcare needs at your convenience.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            to="/about" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;