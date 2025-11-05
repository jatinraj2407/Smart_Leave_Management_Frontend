import React, { useEffect, useState } from 'react';
import {
  getAllAdminLeaveRequests,
  approveLeaveAdmin,
  rejectLeaveAdmin
} from '../../services/api';
import '../../css/admin/GetAllRequests.css';

function GetAllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const adminId = sessionStorage.getItem('userId');

  const fetchRequests = async () => {
    if (!adminId) return setMessage('Missing authentication. Please log in again.');
    try {
      const res = await getAllAdminLeaveRequests(adminId);
      setRequests(res.data);
    } catch (err) {
      setMessage('Failed to fetch leave requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (leaveId, action) => {
    try {
      const res =
        action === 'approve'
          ? await approveLeaveAdmin(adminId, leaveId)
          : await rejectLeaveAdmin(adminId, leaveId);
      setMessage(res.data);
      fetchRequests();
    } catch (err) {
      setMessage(err.response?.data || `Failed to ${action} request.`);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <>
      {message && (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <div className="toast show text-bg-info border-0">
            <div className="d-flex">
              <div className="toast-body">{message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setMessage('')}
              ></button>
            </div>
          </div>
        </div>
      )}

      <div className="container mt-5">
        <h3>All Leave Requests 📄</h3>
        {loading ? (
          <div className="text-muted mt-4">Loading leave requests...</div>
        ) : (
          <div className="table-responsive mt-4">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-success">
                <tr>
                  <th>Leave ID</th>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Leave Status</th>
                  <th>Approver</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.leaveId}>
                    <td>{req.leaveId}</td>
                    <td>{req.userId}</td>
                    <td>{req.userName}</td>
                    <td>{req.userRole}</td>
                    <td>{req.leaveType}</td>
                    <td>{req.startDate}</td>
                    <td>{req.endDate}</td>
                    <td>{req.duration}</td>
                    <td>{req.leaveStatus}</td>
                    <td>{req.leaveTypePlannedAndUnplanned}</td>
                    <td>{req.approver || '—'}</td>
                    <td>
                      {req.leaveStatus === 'PENDING' ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleAction(req.leaveId, 'approve')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleAction(req.leaveId, 'reject')}
                          >
                            Reject
                          </button>
                        </>
                      ) : req.leaveStatus === 'APPROVED' ? (
                        <span className="badge bg-success">Approved</span>
                      ) : req.leaveStatus === 'REJECTED' ? (
                        <span className="badge bg-danger">Rejected</span>
                      ) : (
                        ''
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default GetAllRequests;
