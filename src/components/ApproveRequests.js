import React, { useEffect, useState } from 'react';
import {
  getAllLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest
} from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function ApproveRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const userId = sessionStorage.getItem('userId');
  const userRole = sessionStorage.getItem('userRole');

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  useEffect(() => {
    if (!userId || !userRole) {
      alert('Session expired. Please log in again.');
      navigate('/user-login');
      return;
    }

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await getAllLeaveRequests(userId);
        const pending = res.data.filter(req => {
          const requesterRole = req.userRole?.toUpperCase();
          return (
            req.leaveStatus === 'PENDING' &&
            ['TEAM_MEMBER', 'TEAM_LEAD'].includes(requesterRole) &&
            ['HR_MANAGER', 'TEAM_MANAGER'].includes(userRole)
          );
        });
        setRequests(pending);
      } catch (err) {
        console.error('Error loading requests:', err);
        setMessage('Failed to load leave requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId, userRole, navigate]);

  const refreshRequests = async () => {
    try {
      const res = await getAllLeaveRequests(userId);
      const pending = res.data.filter(req => {
        const requesterRole = req.userRole?.toUpperCase();
        return (
          req.leaveStatus === 'PENDING' &&
          ['TEAM_MEMBER', 'TEAM_LEADER'].includes(requesterRole) &&
          ['HR_MANAGER', 'TEAM_MANAGER'].includes(userRole)
        );
      });
      setRequests(pending);
    } catch (err) {
      console.error('Error refreshing requests:', err);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      const res = await approveLeaveRequest(userId, leaveId);
      setMessage(res.data || 'Leave approved successfully.');
      refreshRequests();
    } catch (error) {
      const msg = error.response?.data || 'Failed to approve request.';
      setMessage(typeof msg === 'string' ? msg : 'Something went wrong.');
    }
  };

  const handleReject = async (leaveId) => {
    try {
      const res = await rejectLeaveRequest(userId, leaveId);
      setMessage(res.data || 'Leave rejected successfully.');
      refreshRequests();
    } catch (error) {
      const msg = error.response?.data || 'Failed to reject request.';
      setMessage(typeof msg === 'string' ? msg : 'Something went wrong.');
    }
  };

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="container mt-5">
        <h2 className="mb-4 text-center">✅ Approve Leave Requests</h2>

        {message && (
          <div className="alert alert-info text-center">{message}</div>
        )}

        {loading ? (
          <p className="text-center text-muted">Loading pending requests...</p>
        ) : requests.length > 0 ? (
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Role</th>
                <th>Leave Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req.leaveId}>
                  <td>{index + 1}</td>
                  <td>{req.userName}</td>
                  <td>{req.userRole}</td>
                  <td>{req.leaveType}</td>
                  <td>{new Date(req.startDate).toLocaleDateString()}</td>
                  <td>{new Date(req.endDate).toLocaleDateString()}</td>
                  <td>{req.reason}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleApprove(req.leaveId)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleReject(req.leaveId)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-muted">No pending leave requests.</p>
        )}
      </div>
    </>
  );
}

export default ApproveRequests;
