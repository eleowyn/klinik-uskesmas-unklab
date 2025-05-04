import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStaffContext } from '../../context/StaffContext';

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
      <h4 className="font-medium text-gray-800">
        {appointment.patientName} 
        <span className="text-gray-500 text-sm ml-2">
          with Dr. {appointment.doctorName}
        </span>
      </h4>
      <p className="text-sm text-gray-500">
        {new Date(appointment.date).toLocaleString()}
      </p>
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

const TransactionItem = ({ transaction }) => (
  <div className="flex items-center p-4 bg-white rounded-lg border border-gray-100 mb-3 hover:shadow-sm transition-shadow">
    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
      <i className="fas fa-file-invoice-dollar text-green-500"></i>
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-gray-800">{transaction.patientName}</h4>
      <p className="text-sm text-gray-500">
        {new Date(transaction.date).toLocaleDateString()}
      </p>
    </div>
    <div className="text-right">
      <p className="font-medium text-gray-800">${transaction.amount}</p>
      <p className={`text-sm ${
        transaction.status === 'paid' ? 'text-green-600' :
        transaction.status === 'pending' ? 'text-yellow-600' :
        'text-red-600'
      }`}>
        {transaction.status}
      </p>
    </div>
  </div>
);

const StaffDashboard = () => {
  const { dashboardData, refreshDashboardData, loading } = useStaffContext();
  const { patients, appointments, transactions } = dashboardData;

  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Get today's appointments
  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  });

  // Get recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {dashboardData.staffProfile?.fullName}
        </h1>
        <p className="opacity-90">Here's what's happening at the clinic today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          title="Total Patients"
          value={patients.length}
          icon="fas fa-users"
          color="bg-blue-500"
          link="/staff/patients"
        />
        <DashboardCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon="fas fa-calendar-check"
          color="bg-green-500"
          link="/staff/appointments"
        />
        <DashboardCard
          title="Pending Payments"
          value={transactions.filter(t => t.status === 'pending').length}
          icon="fas fa-file-invoice-dollar"
          color="bg-yellow-500"
          link="/staff/transactions"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Today's Appointments</h2>
            <Link to="/staff/appointments" className="text-blue-500 hover:text-blue-600 text-sm">
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

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
            <Link to="/staff/transactions" className="text-blue-500 hover:text-blue-600 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map(transaction => (
                <TransactionItem key={transaction._id} transaction={transaction} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
