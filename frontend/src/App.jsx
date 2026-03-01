import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import PatientDetail from './pages/PatientDetail';
import Appointments from './pages/Appointments';
import AppointmentForm from './pages/AppointmentForm';
import AppointmentDetail from './pages/AppointmentDetail';
import Prescriptions from './pages/Prescriptions';
import PrescriptionForm from './pages/PrescriptionForm';
import PrescriptionDetail from './pages/PrescriptionDetail';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Patients />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/new"
            element={
              <ProtectedRoute roles={['admin', 'receptionist']}>
                <DashboardLayout>
                  <PatientForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PatientDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Appointments />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/new"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AppointmentForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AppointmentDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Prescriptions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions/new"
            element={
              <ProtectedRoute roles={['admin', 'doctor']}>
                <DashboardLayout>
                  <PrescriptionForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PrescriptionDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={['admin']}>
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute roles={['admin', 'doctor']}>
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
