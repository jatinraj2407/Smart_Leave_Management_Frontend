import React, { useEffect, useState } from 'react';
import {
  getUserLeaveRequests,
  getAllLeaveRequests,
  cancelLeaveRequest
} from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function LeaveRequests() {
  const [requests, setRequests] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = parseInt(sessionStorage.getItem('userId'), 10);
  const role = sessionStorage.getItem('role');
  const normalizedRole = sessionStorage.getItem('userRole')?.toUpperCase();

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      alert('Session expired. Please log in again.');
      sessionStorage.clear();
      navigate('/user-login');
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = viewAll
          ? await getAllLeaveRequests(userId)
          : await getUserLeaveRequests(userId);

        let data = response.data;

        if (viewAll) {
          data = data.filter((req) => {
            const requesterRole = req.userRole?.toUpperCase();
            if (req.leaveStatus === 'CANCELLED') return false;

            if (normalizedRole === 'ADMIN') return true;

            if (['HR_MANAGER', 'TEAM_MANAGER'].includes(normalizedRole)) {
              return ['TEAM_MEMBER', 'TEAM_LEADER'].includes(requesterRole);
            }

            return false;
          });
        }

        setRequests(data);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        if (error.response?.status === 403) {
          alert('Access denied. Please log in again.');
          sessionStorage.clear();
          navigate('/user-login');
        } else {
          alert('Failed to load leave requests');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId, viewAll, navigate, normalizedRole]);

  const handleCancel = async (leaveId) => {
    try {
      await cancelLeaveRequest(userId, leaveId);
      alert('Leave request cancelled.');
      setRequests((prev) =>
        prev.map((req) =>
          req.leaveId === leaveId ? { ...req, leaveStatus: 'CANCELLED' } : req
        )
      );
    } catch (error) {
      console.error('Cancel failed:', error);
      alert('Unable to cancel leave request.');
    }
  };

  return (
    <>
      <Navbar darkMode={false} setDarkMode={() => {}} />

      <div className="container mt-5">
        <h2 className="mb-4 text-center">📋 Leave Requests</h2>

        {['Admin', 'Manager', 'HR_MANAGER', 'TEAM_MANAGER', 'ADMIN'].includes(role) && (
          <div className="text-center mb-3 d-flex flex-wrap justify-content-center gap-2">
            <button
              className="btn btn-outline-primary"
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
        )}

        {loading ? (
          <div className="text-center text-muted">Loading leave requests...</div>
        ) : requests.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Approver</th>
                  <th>Comments</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr key={req.leaveId || index}>
                    <td>{index + 1}</td>
                    <td>{req.leaveType}</td>
                    <td>{new Date(req.startDate).toLocaleDateString()}</td>
                    <td>{new Date(req.endDate).toLocaleDateString()}</td>
                    <td>{req.leaveStatus}</td>
                    <td>{req.approver || '—'}</td>
                    <td>{req.comments?.trim() || '—'}</td>
                    <td>
                      {!viewAll && req.leaveStatus === 'PENDING' && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCancel(req.leaveId)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted">No leave requests found.</p>
        )}
      </div>
    </>
  );
}

export default LeaveRequests;
