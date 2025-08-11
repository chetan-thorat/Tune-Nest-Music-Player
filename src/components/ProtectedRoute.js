// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Or use context/auth state

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}