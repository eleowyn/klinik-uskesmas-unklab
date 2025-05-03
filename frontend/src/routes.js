import React from 'react';
import { Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorPortal from './pages/DoctorPortal';
import StaffPortal from './pages/StaffPortal';
import PatientPortal from './pages/PatientPortal';

// Doctor Components
import DoctorDashboard from './components/doctor/DoctorDashboard';
import PatientList from './components/doctor/PatientList';
import PatientDetails from './components/doctor/PatientDetails';
import PrescriptionForm from './components/doctor/PrescriptionForm';
import PrescriptionList from './components/doctor/PrescriptionList';
import Schedule from './components/doctor/Schedule';

// Staff Components
import StaffDashboard from './components/staff/StaffDashboard';
import PatientManagement from './components/staff/PatientManagement';
import PatientForm from './components/staff/PatientForm';
import TransactionForm from './components/staff/TransactionForm';
import TransactionManagement from './components/staff/TransactionManagement';
import TransactionDetail from './components/staff/TransactionDetail';
import AppointmentManagement from './components/staff/AppointmentManagement';
import AppointmentForm from './components/staff/AppointmentForm';

import ProtectedRoute from './components/common/ProtectedRoute';

const routes = [
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/doctor',
    element: (
      <ProtectedRoute allowedRoles={['doctor']}>
        <DoctorPortal />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DoctorDashboard />
      },
      {
        path: 'patients',
        element: <PatientList />
      },
      {
        path: 'patients/:id',
        element: <PatientDetails />
      },
      {
        path: 'prescriptions',
        element: <PrescriptionList />
      },
      {
        path: 'prescriptions/new',
        element: <PrescriptionForm />
      },
      {
        path: 'schedule',
        element: <Schedule />
      }
    ]
  },
  {
    path: '/staff',
    element: (
      <ProtectedRoute allowedRoles={['staff']}>
        <StaffPortal />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <StaffDashboard />
      },
      {
        path: 'patients',
        element: <PatientManagement />
      },
      {
        path: 'patients/new',
        element: <PatientForm />
      },
      {
        path: 'patients/:id/edit',
        element: <PatientForm />
      },
      {
        path: 'transactions',
        element: <TransactionManagement />
      },
      {
        path: 'transactions/new',
        element: <TransactionForm />
      },
      {
        path: 'transactions/:id',
        element: <TransactionDetail />
      },
      {
        path: 'transactions/:id/edit',
        element: <TransactionForm />
      },
      {
        path: 'appointments',
        element: <AppointmentManagement />
      },
      {
        path: 'appointments/new',
        element: <AppointmentForm />
      },
      {
        path: 'appointments/:id/edit',
        element: <AppointmentForm />
      }
    ]
  },
  {
    path: '/patient',
    element: (
      <ProtectedRoute allowedRoles={['patient']}>
        <PatientPortal />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];

export default routes;
