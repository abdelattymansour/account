import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Invoices from './pages/Invoices';
import Customers from './pages/Customers';
import Expenses from './pages/Expenses';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
