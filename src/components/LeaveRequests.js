import React, { useEffect, useState } from 'react';
import {
  getUserLeaveRequests,
  getAllLeaveRequests,
} from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function LeaveRequests() {
  const [requests, setRequests] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const navigate = useNavigate();
  const userId = parseInt(sessionStorage.getItem('userId'), 10);
  const role = sessionStorage.getItem('role');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = viewAll
          ? await getAllLeaveRequests(userId)
          : await getUserLeaveRequests(userId);
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        if (error.response?.status === 403) {
          alert('Access denied. Please log in again.');
          sessionStorage.clear();
          navigate('/user-login');
        } else {
          alert('Failed to load leave requests');
        }
      }
    };
    fetchRequests();
  }, [userId, viewAll, navigate]);

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate('/user-login');
  };

  return (
    <>
      {/* Navbar */}
      <div style={{
        backgroundColor: '#00796b',
        padding: '1rem 2rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Smart Leave Manager</h1>
        <div>
          <Link to="/user-dashboard" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/apply-leave" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Apply Leave</Link>
          <Link to="/leave-calendar" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Calendar</Link>
          <Link to="/leave-balance" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Balance</Link>
          <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      {/* Leave Requests */}
      <div className="container mt-5">
        <h2 className="mb-4 text-center">📋 Leave Requests</h2>

        {role === 'Admin' || role === 'Manager' ? (
          <div className="text-center mb-3">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setViewAll(false)}
              disabled={!viewAll}
            >
              My Requests
            </button>
            <button
              className="btn btn-outline-success"
              onClick={() => setViewAll(true)}
              disabled={viewAll}
            >
              All Requests
            </button>
          </div>
        ) : null}

        {requests.length > 0 ? (
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{req.leaveType}</td>
                  <td>{req.startDate}</td>
                  <td>{req.endDate}</td>
                  <td>{req.status}</td>
                  <td>{req.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-muted">No leave requests found.</p>
        )}
      </div>
    </>
  );
}

export default LeaveRequests;
