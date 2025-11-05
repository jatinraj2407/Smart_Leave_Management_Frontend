import React, { useEffect, useState } from 'react';
import {
  getAllUsers,
  deleteUserAccount,
  promoteUser
} from '../../services/api';
import '../../css/admin/GetAllUsers.css';

function GetAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [promoting, setPromoting] = useState({});
  const adminId = sessionStorage.getItem('userId');
  const allRoles = ['TEAM_MEMBER', 'TEAM_LEAD', 'TEAM_MANAGER', 'HR_MANAGER'];

  const fetchUsers = async () => {
    if (!adminId) return setMessage('Missing authentication. Please log in again.');
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      setMessage('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await deleteUserAccount(adminId, userId);
      setMessage(res.data);
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data || 'Failed to delete user.');
    }
  };

  const handlePromote = async (userId, newRole) => {
    if (!newRole || !adminId) return;
    setPromoting((prev) => ({ ...prev, [userId]: true }));
    try {
      await promoteUser(adminId, userId, newRole);
      setMessage('User promoted successfully.');
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data || 'Promotion failed.');
    } finally {
      setPromoting((prev) => ({ ...prev, [userId]: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="container mt-5">Loading users...</div>;

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
        <h3>All Registered Users 👥</h3>
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-hover align-middle text-center">
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
                <th>Promote</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const currentRole = user.role?.roleName || user.userRole;
                const availableRoles = allRoles.filter(
                  (r) => r !== currentRole && r !== 'ADMIN'
                );

                return (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.userName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.countryName}</td>
                    <td>{currentRole}</td>
                    <td>{user.gender}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user.userId)}
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        defaultValue=""
                        disabled={promoting[user.userId]}
                        onChange={(e) => handlePromote(user.userId, e.target.value)}
                      >
                        <option value="">Promote to...</option>
                        {availableRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default GetAllUsers;
