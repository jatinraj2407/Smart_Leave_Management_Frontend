import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/admin/GetAllUsers.css';

function GetAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      setMessage('Missing authentication. Please log in again.');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:8765/admin/get-all-users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessage('Failed to fetch users.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-5">Loading users...</div>;
  if (message) return <div className="container mt-5 alert alert-danger">{message}</div>;

  return (
    <div className="container mt-5">
      <h3>All Registered Users 👥</h3>
      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover">
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Role</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.userName}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.countryName}</td>
                <td>{user.role?.roleName || user.userRole}</td>
                <td>{user.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetAllUsers;