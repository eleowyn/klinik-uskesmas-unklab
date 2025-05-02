import React from 'react';

const About = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">About KLINIK USKESMAS UNKLAB</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Established in 2005, KLINIK USKESMAS UNKLAB has been serving the healthcare needs of the 
              Universitas Klabat community and the surrounding areas for over 15 years. What started as 
              a small campus clinic has grown into a comprehensive healthcare facility.
            </p>
            <p className="text-gray-600 mb-4">
              Our mission is to provide accessible, affordable, and quality healthcare services to 
              students, faculty, staff, and the local community.
            </p>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Clinic Building" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">General Medicine</h3>
              <p className="text-gray-600">
                Comprehensive primary care services for all ages, including health screenings and vaccinations.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Dental Care</h3>
              <p className="text-gray-600">
                Routine dental check-ups, cleanings, fillings, and other basic dental procedures.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Pediatrics</h3>
              <p className="text-gray-600">
                Specialized care for infants, children, and adolescents, including growth monitoring.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Obstetrics & Gynecology</h3>
              <p className="text-gray-600">
                Women's health services including prenatal care, family planning, and annual exams.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Laboratory Tests</h3>
              <p className="text-gray-600">
                On-site laboratory for blood tests, urinalysis, and other diagnostic procedures.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Pharmacy</h3>
              <p className="text-gray-600">
                Well-stocked pharmacy providing prescribed medications and over-the-counter drugs.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-100 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4 text-center">Our Team</h2>
          <p className="text-gray-700 text-center max-w-3xl mx-auto">
            Our clinic is staffed by a team of dedicated healthcare professionals including doctors, 
            nurses, dentists, and support staff who are committed to providing compassionate and 
            professional care to all our patients.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;