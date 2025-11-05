import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem('userRole');

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/user-login');
  };

  return (
    <nav className={`navbar navbar-expand-lg custom-navbar ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container-fluid">
        <Link to="/user-dashboard" className="navbar-brand">
          Smart Leave Manager
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/apply-leave">Apply Leave</Link>
            <Link className="nav-link" to="/leave-calendar">Calendar</Link>
            <Link className="nav-link" to="/leave-balance">Balance</Link>
            <Link className="nav-link" to="/leave-requests">Requests</Link>

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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
