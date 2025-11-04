import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/admin/GetAllRequests.css';

function GetAllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = sessionStorage.getItem('authToken');
  const adminId = sessionStorage.getItem('userId');

  const fetchRequests = () => {
    if (!token || !adminId) {
      setMessage('Missing authentication. Please log in again.');
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8765/admin/get-all-leave-requests/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessage('Failed to fetch leave requests.');
        setLoading(false);
      });
  };

  const handleAction = async (leaveId, action) => {
    const endpoint = action === 'approve' ? 'approve' : 'reject';

    try {
      const res = await axios.post(
        `http://localhost:8765/admin/${endpoint}/${adminId}/${leaveId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data);
      fetchRequests(); // Refresh list
    } catch (error) {
      const msg = error.response?.data || `Failed to ${action} request.`;
      setMessage(typeof msg === 'string' ? msg : 'Something went wrong.');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <div className="container mt-5">Loading leave requests...</div>;
  if (message) return <div className="container mt-5 alert alert-info">{message}</div>;

  return (
    <div className="container mt-5">
      <h3>All Leave Requests 📄</h3>
      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover">
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
                  {req.leaveStatus === 'APPROVED' ? (
                    <span className="badge bg-success">Approved</span>
                  ) : req.leaveStatus === 'REJECTED' ? (
                    <span className="badge bg-danger">Rejected</span>
                  ) : (
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetAllRequests;