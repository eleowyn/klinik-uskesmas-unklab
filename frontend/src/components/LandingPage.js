import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f9ff' }}>
      {/* Hero Section */}
      <header className="container mx-auto px-6 py-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900 opacity-10 transform -skew-y-6 animate-slide-in"></div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-6xl font-extrabold mb-6 animate-fade-in-up">
            KLINIK USKESMAS UNKLAB
          </h1>
          <p className="text-2xl max-w-3xl mx-auto mb-12 text-blue-100 animate-fade-in-up delay-200">
            Providing quality healthcare services to the UNKLAB community and surrounding areas.
          </p>
          <div className="space-x-4 animate-fade-in-up delay-400">
            <Link
              to="/login"
              className="inline-block bg-green-500 text-white font-semibold py-4 px-10 rounded-full shadow-lg hover-lift"
            >
              Login for Doctor/Staff
            </Link>
            <Link
              to="/about"
              className="inline-block bg-white/20 text-white font-semibold py-4 px-10 rounded-full shadow-lg backdrop-blur-sm hover-lift"
            >
              Learn More
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-xl hover-lift animate-fade-in-up">
            <div className="text-6xl mb-6 text-blue-600 hover-rotate">
              <i className="fas fa-user-md"></i>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Experienced Doctors</h2>
            <p className="text-gray-600">Our team of qualified doctors provide expert care in various specialties.</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-xl hover-lift animate-fade-in-up delay-200">
            <div className="text-6xl mb-6 text-green-500 hover-rotate">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Comprehensive Care</h2>
            <p className="text-gray-600">From general medicine to specialized treatments, we've got you covered.</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-xl hover-lift animate-fade-in-up delay-400">
            <div className="text-6xl mb-6 text-blue-600 hover-rotate">
              <i className="fas fa-clock"></i>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Convenient Hours</h2>
            <p className="text-gray-600">Open 6 days a week to serve your healthcare needs at your convenience.</p>
          </div>
        </div>

        {/* Services Section */}
        <section className="bg-white rounded-2xl p-12 mt-32 mb-32 shadow-xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 animate-fade-in-up">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center hover-lift animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center hover-rotate">
                <i className="fas fa-stethoscope text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">General Check-up</h3>
              <p className="text-gray-600">Comprehensive health assessments</p>
            </div>

            <div className="text-center hover-lift animate-fade-in-up delay-200">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center hover-rotate">
                <i className="fas fa-pills text-3xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pharmacy</h3>
              <p className="text-gray-600">Complete medication services</p>
            </div>

            <div className="text-center hover-lift animate-fade-in-up delay-400">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center hover-rotate">
                <i className="fas fa-procedures text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Emergency Care</h3>
              <p className="text-gray-600">24/7 emergency services</p>
            </div>

            <div className="text-center hover-lift animate-fade-in-up delay-600">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center hover-rotate">
                <i className="fas fa-notes-medical text-3xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lab Tests</h3>
              <p className="text-gray-600">Modern diagnostic facilities</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="hover-lift animate-fade-in-up">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="mb-2"><i className="fas fa-phone mr-2"></i> +62 123 4567 890</p>
              <p className="mb-2"><i className="fas fa-envelope mr-2"></i> info@klinikuskesmasunklab.com</p>
              <p><i className="fas fa-map-marker-alt mr-2"></i> UNKLAB Campus</p>
            </div>

            <div className="hover-lift animate-fade-in-up delay-200">
              <h3 className="text-xl font-bold mb-4">Hours</h3>
              <p className="mb-2">Monday - Friday: 8:00 AM - 8:00 PM</p>
              <p>Saturday: 8:00 AM - 2:00 PM</p>
            </div>

            <div className="hover-lift animate-fade-in-up delay-400">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-blue-300 transition-colors">About Us</Link></li>
                <li><Link to="/services" className="hover:text-blue-300 transition-colors">Services</Link></li>
                <li><Link to="/login" className="hover:text-blue-300 transition-colors">Doctor/Staff Login</Link></li>
              </ul>
            </div>

            <div className="hover-lift animate-fade-in-up delay-600">
              <h3 className="text-xl font-bold mb-4">Emergency</h3>
              <p className="text-2xl font-bold text-green-400">+62 123 4567 890</p>
              <p className="mt-2">Available 24/7 for emergencies</p>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-12 pt-8 text-center animate-fade-in-up delay-800">
            <p>© 2025 KLINIK USKESMAS UNKLAB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
