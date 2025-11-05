import React, { useState, useEffect } from 'react';
import { addNewRole, getAllRoles } from '../../services/api';
import '../../css/admin/AddRole.css';

function AddRole() {
  const [form, setForm] = useState({ roleName: '', description: '' });
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [roles, setRoles] = useState([]);
  const adminId = sessionStorage.getItem('userId');

  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId) return setMessage('Missing authentication. Please log in again.');

    try {
      const res = await addNewRole(adminId, form);
      setMessage(res.data);
      setForm({ roleName: '', description: '' });
      fetchRoles();
    } catch (err) {
      setMessage(err.response?.data || 'Failed to add role.');
    }
  };

  const fetchRoles = async () => {
    if (!adminId) return;
    try {
      const res = await getAllRoles(adminId);
      setRoles(res.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
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
                  disabled={roles.some((r) => r.roleName === role)}
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
