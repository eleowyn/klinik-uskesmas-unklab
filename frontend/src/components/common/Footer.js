import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">KLINIK USKESMAS UNKLAB</h3>
            <p className="text-gray-400">Providing quality healthcare services</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400 transition">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} KLINIK USKESMAS UNKLAB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;