import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>
      <ul>
        <li><Link to="/apply-leave">Apply Leave</Link></li>
        <li><Link to="/leave-calendar">Leave Calendar</Link></li>
        <li><Link to="/leave-report">Leave Report</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </div>
  );
}

export default Dashboard;
