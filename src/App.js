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
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AddRole from './components/admin/AddRole'
import ApplyLeavePolicy from './components/admin/ApplyLeavePolicy';
import AddCountryCalendar from './components/admin/AddCountryCalendar';
import GetAllUsers from './components/admin/GetAllUsers';
import GetAllRequests from './components/admin/GetAllRequests';
import AdminHome from './components/admin/AdminHome';

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
        
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="add-role" element={<AddRole />} />
          <Route path="apply-leave-policy" element={<ApplyLeavePolicy />} />
          <Route path="add-country-calendar" element={<AddCountryCalendar />} />
          <Route path="get-all-users" element={<GetAllUsers />} />
          <Route path="get-all-requests" element={<GetAllRequests />} />
          {/* Other admin routes will go here */}
        </Route>


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
