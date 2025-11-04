import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem('userRole'); // ✅ Read role from session

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/user-login');
  };

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} px-4`}>
      <span className="navbar-brand">Smart Leave Manager</span>
      <div className="navbar-nav ms-auto">
        <Link className="nav-link" to="/user-dashboard">Dashboard</Link>
        <Link className="nav-link" to="/apply-leave">Apply Leave</Link>
        <Link className="nav-link" to="/leave-calendar">Calendar</Link>
        <Link className="nav-link" to="/leave-balance">Balance</Link>
        <Link className="nav-link" to="/leave-requests">Requests</Link>

        {/* ✅ Conditionally show Approve Requests */}
        {(userRole === 'HR_MANAGER' || userRole === 'TEAM_MANAGER') && (
          <Link className="nav-link" to="/approve-requests">Approve Requests</Link>
        )}

        <button onClick={handleSignOut} className="btn btn-link nav-link">Sign Out</button>
        <button
          className="btn btn-sm btn-outline-secondary ms-2"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
