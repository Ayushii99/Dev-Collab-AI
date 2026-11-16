import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Temporarily redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Fallback route */}
        <Route path="*" element={<div className="flex justify-center items-center h-screen text-white bg-gray-900 text-2xl">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}