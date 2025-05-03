import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, value, icon, color, link }) => (
  <Link 
    to={link} 
    className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
        <i className={`${icon} text-white text-xl`}></i>
      </div>
    </div>
  </Link>
);

const AppointmentItem = ({ appointment }) => (
  <div className="flex items-center p-4 bg-white rounded-lg border border-gray-100 mb-3 hover:shadow-sm transition-shadow">
    <div className="w-2 h-2 rounded-full bg-blue-500 mr-4"></div>
    <div className="flex-1">
      <h4 className="font-medium text-gray-800">{appointment.patientName}</h4>
      <p className="text-sm text-gray-500">{new Date(appointment.date).toLocaleString()}</p>
    </div>
    <div className={`px-3 py-1 rounded-full text-sm ${
      appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
      appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
      'bg-blue-100 text-blue-700'
    }`}>
      {appointment.status}
    </div>
  </div>
);

const PrescriptionItem = ({ prescription }) => (
  <div className="flex items-center p-4 bg-white rounded-lg border border-gray-100 mb-3 hover:shadow-sm transition-shadow">
    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
      <i className="fas fa-prescription text-purple-500"></i>
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-gray-800">{prescription.patientName}</h4>
      <p className="text-sm text-gray-500">{new Date(prescription.date).toLocaleDateString()}</p>
    </div>
    <Link 
      to={`/doctor/prescriptions/${prescription._id}`}
      className="text-blue-500 hover:text-blue-600"
    >
      <i className="fas fa-chevron-right"></i>
    </Link>
  </div>
);

const DoctorDashboard = ({ dashboardData }) => {
  const { patients, appointments, prescriptions, doctorProfile } = dashboardData;

  // Get today's appointments
  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  });

  // Get recent prescriptions
  const recentPrescriptions = prescriptions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, Dr. {doctorProfile?.fullName}
        </h1>
        <p className="opacity-90">Here's what's happening with your patients today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Patients"
          value={patients.length}
          icon="fas fa-users"
          color="bg-blue-500"
          link="/doctor/patients"
        />
        <DashboardCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon="fas fa-calendar-check"
          color="bg-green-500"
          link="/doctor/schedule"
        />
        <DashboardCard
          title="Total Prescriptions"
          value={prescriptions.length}
          icon="fas fa-prescription"
          color="bg-purple-500"
          link="/doctor/prescriptions"
        />
        <DashboardCard
          title="Pending Reviews"
          value={appointments.filter(apt => apt.status === 'pending').length}
          icon="fas fa-clock"
          color="bg-yellow-500"
          link="/doctor/schedule"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Today's Appointments</h2>
            <Link to="/doctor/schedule" className="text-blue-500 hover:text-blue-600 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {todayAppointments.length > 0 ? (
              todayAppointments.map(appointment => (
                <AppointmentItem key={appointment._id} appointment={appointment} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No appointments for today</p>
            )}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Prescriptions</h2>
            <Link to="/doctor/prescriptions" className="text-blue-500 hover:text-blue-600 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentPrescriptions.length > 0 ? (
              recentPrescriptions.map(prescription => (
                <PrescriptionItem key={prescription._id} prescription={prescription} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent prescriptions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
