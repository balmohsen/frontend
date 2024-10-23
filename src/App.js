import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CertificationForm from './components/CertificationForm';
import COCDashboard from './components/COCDashboard';
import AdminDashboard from './components/AdminDashboard';
import PendingApprovals from './components/PendingApprovals';
import Notifications from './components/Notifications';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Header from './components/Header';
import SubmissionSuccess from './components/SubmissionSuccess';
import ViewSubmissions from './components/ViewSubmissions';
import SubmissionDetail from './components/SubmissionDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Conditionally render Header only if the user is authenticated */}
        <ProtectedRoute>
          <Header />
        </ProtectedRoute>
        
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certification-form"
            element={
              <ProtectedRoute>
                <CertificationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coc-dashboard"
            element={
              <ProtectedRoute>
                <COCDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRoles="administrator">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pending-approvals"
            element={
              <ProtectedRoute requiredRoles={['finance', 'manager', 'vp']}>
                <PendingApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submission-success"
            element={
              <ProtectedRoute>
                <SubmissionSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-submissions"
            element={
              <ProtectedRoute>
                <ViewSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submission/:id"
            element={
              <ProtectedRoute>
                <SubmissionDetail />
              </ProtectedRoute>
            }
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
