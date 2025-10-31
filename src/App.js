import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminRegister from './components/AdminRegister';
import UserRegister from './components/UserRegister';
import ApplyLeave from './components/ApplyLeave';
import LeaveCalendar from './components/LeaveCalendar';
import LeaveBalance from './components/LeaveBalance';
import LeaveRequests from './components/LeaveRequests';
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
        {/* Role selection landing page */}
        <Route path="/" element={<RoleSelection />} />

        {/* User routes */}
        <Route path="/user-login" element={<Login role="User" />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />

        {/* Admin routes */}
        <Route path="/admin-login" element={<Login role="Admin" />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* Shared routes */}
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/leave-calendar" element={<LeaveCalendar />} />
        <Route path="/leave-balance" element={<LeaveBalance />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-username" element={<ForgotUsername />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
