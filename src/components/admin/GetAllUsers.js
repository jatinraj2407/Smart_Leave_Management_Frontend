import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/admin/GetAllUsers.css';

function GetAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = sessionStorage.getItem('authToken');
  const adminId = sessionStorage.getItem('userId');

  const fetchUsers = () => {
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
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await axios.delete(
        `http://localhost:8765/admin/delete-user/${adminId}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data);
      fetchUsers(); // Refresh list
    } catch (error) {
      const msg = error.response?.data || 'Failed to delete user.';
      setMessage(typeof msg === 'string' ? msg : 'Something went wrong.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="container mt-5">Loading users...</div>;
  if (message) return <div className="container mt-5 alert alert-info">{message}</div>;

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
              <th>Action</th>
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
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.userId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetAllUsers;