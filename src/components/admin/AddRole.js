import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/admin/AddRole.css';

function AddRole() {
  const [form, setForm] = useState({ roleName: '', description: '' });
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [roles, setRoles] = useState([]);

  const token = sessionStorage.getItem('authToken');
  const adminId = sessionStorage.getItem('userId');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!token || !adminId) {
      setMessage('Missing authentication. Please log in again.');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8765/admin/add-newrole/${adminId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data);
      setForm({ roleName: '', description: '' });
      fetchRoles(); // Refresh role list
    } catch (error) {
      const msg = error.response?.data || 'Failed to add role.';
      setMessage(typeof msg === 'string' ? msg : 'Something went wrong.');
    }
  };

  const fetchRoles = async () => {
    if (!token || !adminId) return;

    try {
      const res = await axios.get(`http://localhost:8765/admin/get-all-roles/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(res.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="container mt-5">
      <h3>Manage Roles 🛠️</h3>

      <button className="btn btn-primary mt-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'Add New Role'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Role Name</label>
            <select
              name="roleName"
              className="form-select"
              value={form.roleName}
              onChange={handleChange}
              required
            >
              <option value="">Select a Role</option>
              {['TEAM_MEMBER', 'TEAM_LEAD', 'TEAM_MANAGER', 'HR_MANAGER', 'ADMIN'].map((role) => (
                <option
                  key={role}
                  value={role}
                  disabled={roles.some((r) => r.roleName === role)} // Disable if already exists
                >
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success">Add Role</button>
        </form>
      )}

      {message && <div className="alert alert-info mt-3">{message}</div>}

      <h5 className="mt-5">📋 Existing Roles</h5>
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-hover">
          <thead className="table-success">
            <tr>
              <th>Role ID</th>
              <th>Role Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.roleId}>
                <td>{role.roleId}</td>
                <td>{role.roleName}</td>
                <td>{role.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddRole;