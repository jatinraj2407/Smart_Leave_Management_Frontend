import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../../css/admin/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/admin-login');
  };

  return (
    <>
      <div className="navbar">
      <Link to="/admin-dashboard">
  <h1>🛡️ Admin Panel</h1>
</Link>
        <div>
          <Link to="/admin-dashboard/add-role">AddRole</Link>
          <Link to="/admin-dashboard/apply-leave-policy">Leave policies</Link>
          <Link to="/admin-dashboard/add-country-calendar">Calendar</Link>
          <Link to="/admin-dashboard/get-all-users">Users</Link>
          <Link to="/admin-dashboard/get-all-requests">Requests</Link>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>

      <Outlet />
    </>
  );
}

export default AdminDashboard;