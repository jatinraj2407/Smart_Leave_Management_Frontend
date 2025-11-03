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
        <h1>🛡️ Admin Panel</h1>
        <div>
          <Link to="/admin-dashboard/add-role">AddRole</Link>
          <Link to="/admin-dashboard/apply-leave-policy">ALP</Link>
          <Link to="/admin-dashboard/add-country-calendar">ACCH</Link>
          <Link to="/admin-dashboard/get-all-users">GAU</Link>
          <Link to="/admin-dashboard/get-all-requests">GAR</Link>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>

      <div className="container mt-5">
        <h2>Welcome Admin! 🎉</h2>
        <p className="lead">Use the navigation bar to manage roles, leave policies, holidays, users, and requests.</p>
      </div>

      <Outlet />
    </>
  );
}

export default AdminDashboard;