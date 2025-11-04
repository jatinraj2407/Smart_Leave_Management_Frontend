import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminHome() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const adminId = sessionStorage.getItem('userId');

    if (!token || !adminId) {
      setMessage('Missing authentication. Please log in again.');
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8765/admin/get-admin-details/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdmin(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessage('Failed to fetch admin details.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-5">Loading admin details...</div>;
  if (message) return <div className="container mt-5 alert alert-danger">{message}</div>;
  if (!admin) return <div className="container mt-5">No admin data found.</div>;

  return (
    <div className="container mt-5">
      <h3>👤 Admin Profile</h3>
      <div className="card p-4 mt-4 shadow-sm">
        <p><strong>Full Name:</strong> {admin.firstName} {admin.lastName}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Username:</strong> {admin.userName}</p>
        <p><strong>Phone Number:</strong> {admin.phoneNumber}</p>
        <p><strong>Address:</strong> {admin.address}</p>
        <p><strong>Gender:</strong> {admin.gender}</p>
        <p><strong>Role:</strong> {admin.role}</p>
      </div>
    </div>
  );
}

export default AdminHome;