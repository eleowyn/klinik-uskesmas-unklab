import React from 'react';
import { Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorPortal from './pages/DoctorPortal';
import StaffPortal from './pages/StaffPortal';
import PatientPortal from './pages/PatientPortal';
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
    path: '/doctor/*',
    element: (
      <ProtectedRoute allowedRoles={['doctor']}>
        <DoctorPortal />
      </ProtectedRoute>
    )
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
        element: (
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'patients',
        element: (
          <ProtectedRoute allowedRoles={['staff']}>
            <PatientManagement />
          </ProtectedRoute>
        )
      },
      {
        path: 'patients/new',
        element: (
          <ProtectedRoute allowedRoles={['staff']}>
            <PatientForm />
          </ProtectedRoute>
        )
      },
      {
        path: 'patients/:id/edit',
        element: (
          <ProtectedRoute allowedRoles={['staff']}>
            <PatientForm />
          </ProtectedRoute>
        )
      },
      {
        path: 'transactions',
        element: (
          <ProtectedRoute allowedRoles={['staff']}>
            <TransactionManagement />
          </ProtectedRoute>
        )
      },
      {
        path: 'transactions/new',
        element: (
          <ProtectedRoute allowedRoles={['staff']}>
            <TransactionForm />
          </ProtectedRoute>
        )
      },
      {
        path: 'transactions/:id',
        element: (
          <ProtectedRoute allowedRoles={['staff']}>
            <TransactionDetail />
          </ProtectedRoute>
        )
      },
      {
        path: 'transactions/:id/edit',
        element: (
          <ProtectedRoute allowedRoles={['staff']}>
            <TransactionForm />
          </ProtectedRoute>
        )
      },
      {
        path: 'appointments',
        element: (
          <ProtectedRoute allowedRoles={['staff']}>
            <AppointmentManagement />
          </ProtectedRoute>
        )
      },
      {
        path: 'appointments/new',
        element: (
          <ProtectedRoute allowedRoles={['staff']}>
            <AppointmentForm />
          </ProtectedRoute>
        )
      },
      {
        path: 'appointments/:id/edit',
        element: (
          <ProtectedRoute allowedRoles={['staff']}>
            <AppointmentForm />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/patient/*',
    element: (
      <ProtectedRoute allowedRoles={['patient']}>
        <PatientPortal />
      </ProtectedRoute>
    )
  },
  {
    // Catch all route - redirect to home
    path: '*',
    element: <Navigate to="/" replace />
  }
];

export default routes;
