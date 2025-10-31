import React, { useState } from 'react';
import { applyLeave } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserDashboard.css';

function ApplyLeave() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comments, setComments] = useState('');
  const navigate = useNavigate();
  const userId = parseInt(sessionStorage.getItem('userId'), 10);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!leaveType || !startDate || !endDate) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await applyLeave(userId, { leaveType, startDate, endDate, comments });
      alert('Leave applied successfully!');
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setComments('');
    } catch (error) {
      console.error('Leave application failed:', error);
      alert('Failed to apply leave. Please try again.');
    }
  };

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/user-login');
  };

  return (
    <>
      {/* ✅ Navbar */}
      <div className="navbar">
        <h1>Smart Leave Manager</h1>
        <div>
          <Link to="/user-dashboard">Dashboard</Link>
          <Link to="/leave-calendar">Calendar</Link>
          <Link to="/leave-balance">Balance</Link>
          <Link to="/leave-requests">Requests</Link>
          <button onClick={handleSignOut} className="btn btn-link text-white">Sign Out</button>
        </div>
      </div>

      {/* ✅ Leave Form */}
      <div className="container mt-5">
        <h2>Apply for Leave</h2>
        <form onSubmit={handleSubmit} className="card p-4 mt-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label">Leave Type</label>
            <select
              className="form-select"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              <option value="">Select Leave Type</option>
              <option value="SICK_LEAVE">Sick Leave</option>
              <option value="EARNED_LEAVE">Earned Leave</option>
              <option value="CASUAL_LEAVE">Casual Leave</option>
              <option value="PATERNITY_LEAVE">Paternity Leave</option>
              <option value="MATERNITY_LEAVE">Maternity Leave</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Comments</label>
            <textarea
              className="form-control"
              placeholder="Optional comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit Leave Request
          </button>
        </form>
      </div>
    </>
  );
}

export default ApplyLeave;
