import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import Login from './components/Login';
import AdminRegister from './components/AdminRegister';
import UserRegister from './components/UserRegister';
import ApplyLeave from './components/ApplyLeave';
import LeaveCalendar from './components/LeaveCalendar';
import LeaveBalance from './components/LeaveBalance';
import LeaveRequests from './components/LeaveRequests';
import ApproveRequests from './components/ApproveRequests'; // ✅ NEW
import ForgotPassword from './pages/ForgotPassword';
import ForgotUsername from './pages/ForgotUsername';
import Profile from './pages/Profile';
import RoleSelection from './components/RoleSelection';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/user-login" element={<Login role="User" />} />
        <Route path="/admin-login" element={<Login role="Admin" />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-username" element={<ForgotUsername />} />

        {/* Protected Routes */}
        <Route path="/user-dashboard" element={<AuthGuard><UserDashboard /></AuthGuard>} />
        <Route path="/admin-dashboard" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
        <Route path="/apply-leave" element={<AuthGuard><ApplyLeave /></AuthGuard>} />
        <Route path="/leave-calendar" element={<AuthGuard><LeaveCalendar /></AuthGuard>} />
        <Route path="/leave-balance" element={<AuthGuard><LeaveBalance /></AuthGuard>} />
        <Route path="/leave-requests" element={<AuthGuard><LeaveRequests /></AuthGuard>} />
        <Route path="/approve-requests" element={<AuthGuard><ApproveRequests /></AuthGuard>} /> {/* ✅ NEW */}
        <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
      </Routes>
    </Router>
  );
}

export default App;
