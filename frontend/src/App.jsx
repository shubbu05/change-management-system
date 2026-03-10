import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CRList from './pages/CRList';
import CRSubmit from './pages/CRSubmit';
import CRView from './pages/CRView';
import UserManagement from './pages/UserManagement'; // ✅ NEW PAGE


const ProtectedRoute = ({ children, allowedRoles }) => {

  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center">Loading Application...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-10 text-center text-red-500 font-bold text-xl">
        Access Denied
      </div>
    );
  }

  return children;
};


const AppRoutes = () => {

  return (

    <Routes>

      {/* Public Route */}
      <Route path="/login" element={<Login />} />


      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >

        {/* Redirect root → dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Change Requests */}
        <Route path="crs" element={<CRList />} />

        {/* View Change Request */}
        <Route path="crs/:id" element={<CRView />} />

        {/* Submit CR */}
        <Route
          path="crs/new"
          element={
            <ProtectedRoute allowedRoles={['Change Requester', 'Admin']}>
              <CRSubmit />
            </ProtectedRoute>
          }
        />

        {/* ✅ USER MANAGEMENT (ADMIN ONLY) */}
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

      </Route>


      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>

  );
};


function App() {

  return (

    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>

  );
}

export default App;